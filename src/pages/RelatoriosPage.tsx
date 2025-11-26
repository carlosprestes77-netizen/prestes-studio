import React, { useState } from 'react';
import Button from '../components/Button';
import { useFinance } from '../hooks/useFinance';
import { FileDown, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const RelatoriosPage: React.FC = () => {
  const { events, debts } = useFinance();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  
  // Obter anos disponíveis
  const years = Array.from(new Set([
    ...events.map(e => e.monthReference.split('/')[1]),
    ...debts.map(d => d.monthReference.split('/')[1])
  ])).filter(Boolean).sort();

  if (!years.includes(new Date().getFullYear().toString())) {
      years.push(new Date().getFullYear().toString());
  }

  const generatePDF = () => {
    const doc = new jsPDF();

    // Filtros
    const filteredEvents = events.filter(e => e.monthReference.endsWith(selectedYear));
    const filteredDebts = debts.filter(d => d.monthReference.endsWith(selectedYear));

    // Cabeçalho
    doc.setFontSize(18);
    doc.text('Relatório Financeiro – Prestes', 14, 22);
    doc.setFontSize(12);
    doc.text(`Ano de Referência: ${selectedYear}`, 14, 30);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 36);

    let finalY = 45;

    // Seção 1: Resumo Geral
    const totalIncome = filteredEvents.reduce((acc, curr) => acc + curr.totalValue, 0);
    const totalReceived = filteredEvents.filter(e => e.status === 'PAID').reduce((acc, curr) => acc + curr.monthlyValue, 0);
    const totalDebt = filteredDebts.reduce((acc, curr) => acc + curr.totalValue, 0);
    const debtPaid = filteredDebts.filter(d => d.status === 'PAID').reduce((acc, curr) => acc + curr.monthlyValue, 0);

    autoTable(doc, {
        startY: finalY,
        head: [['Métrica', 'Valor (R$)']],
        body: [
            ['Renda Bruta Total', totalIncome.toFixed(2)],
            ['Total Recebido', totalReceived.toFixed(2)],
            ['Dívidas Totais', totalDebt.toFixed(2)],
            ['Dívidas Pagas', debtPaid.toFixed(2)],
            ['Saldo (Recebido - Dívidas Pagas)', (totalReceived - debtPaid).toFixed(2)]
        ],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] } // slate-900
    });

    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Seção 2: Eventos
    doc.text('Detalhes de Eventos', 14, finalY);
    autoTable(doc, {
        startY: finalY + 5,
        head: [['Evento', 'Mês', 'Valor Total', 'Status']],
        body: filteredEvents.map(e => [
            e.name,
            e.monthReference,
            e.totalValue.toFixed(2),
            e.status
        ]),
        theme: 'striped'
    });

    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Seção 3: Dívidas
    doc.text('Detalhes de Dívidas', 14, finalY);
    autoTable(doc, {
        startY: finalY + 5,
        head: [['Descrição', 'Credor', 'Mês', 'Valor Total', 'Status']],
        body: filteredDebts.map(d => [
            d.description,
            d.creditor,
            d.monthReference,
            d.totalValue.toFixed(2),
            d.status === 'PAID' ? 'Pago' : 'Aberto'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [185, 28, 28] } // red-700
    });

    doc.save(`relatorio-prestes-${selectedYear}.pdf`);
  };

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerar Relatórios</h2>
        <p className="text-slate-500">Selecione o período desejado e baixe o PDF completo.</p>
        
        <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col space-y-2 text-left">
                <label className="text-sm font-medium">Selecione o Ano</label>
                <div className="relative">
                    <select 
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm appearance-none dark:bg-slate-950 dark:border-slate-800"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
            </div>

            <Button fullWidth onClick={generatePDF} className="gap-2">
                <FileDown className="h-4 w-4" />
                Baixar PDF
            </Button>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;