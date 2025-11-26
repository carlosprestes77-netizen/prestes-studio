import React, { useRef, useState } from 'react';
import Button from '../components/Button';
import { storageService } from '../services/storageService';
import { Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';

const BackupPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleExport = () => {
    try {
      const data = storageService.getAllData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-prestes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: 'Backup exportado com sucesso!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao exportar backup.' });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        // Validação básica
        if (!data.events && !data.debts && !data.config) {
            throw new Error("Formato inválido");
        }

        if (confirm('Isso substituirá todos os dados atuais. Deseja continuar?')) {
            storageService.importData(data);
            setMessage({ type: 'success', text: 'Dados importados com sucesso! Recarregue a página.' });
            setTimeout(() => window.location.reload(), 1500);
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Arquivo inválido ou corrompido.' });
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[400px]">
       <div className="text-center space-y-4 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Backup e Restauração</h2>
        <p className="text-slate-500">Mantenha seus dados seguros exportando regularmente.</p>

        {message && (
            <div className={`p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                {message.text}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                    <Download className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Exportar Dados</h3>
                <p className="text-sm text-slate-500">Baixe um arquivo JSON com todos os seus eventos e dívidas.</p>
                <Button onClick={handleExport} fullWidth>
                    Exportar Backup
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
                    <Upload className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Importar Dados</h3>
                <p className="text-sm text-slate-500">Restaure dados de um arquivo JSON anterior.</p>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleImport} 
                />
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()} fullWidth>
                    Selecionar Arquivo
                </Button>
            </div>
        </div>
        
        <div className="pt-8">
            <Button variant="danger" onClick={() => {
                if(confirm("ATENÇÃO: Isso apagará TODOS os seus dados permanentemente. Continuar?")) {
                    storageService.clearAll();
                    window.location.reload();
                }
            }}>
                Limpar Todos os Dados
            </Button>
        </div>
       </div>
    </div>
  );
};

export default BackupPage;