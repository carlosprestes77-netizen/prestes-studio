import React, { useState } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useFinance } from '../hooks/useFinance';
import { Debt, PaymentStatus } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const DividasPage: React.FC = () => {
  const { debts, actions } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDebt, setCurrentDebt] = useState<Debt | null>(null);

  const [formData, setFormData] = useState<Partial<Debt>>({
    description: '',
    creditor: '',
    type: '',
    monthReference: new Date().toISOString().slice(0, 7).split('-').reverse().join('/'),
    totalValue: 0,
    monthlyValue: 0,
    installmentsPaid: 0,
    installmentsTotal: 1,
    status: 'PENDING',
  });

  const handleOpenModal = (debt?: Debt) => {
    if (debt) {
      setFormData(debt);
      setCurrentDebt(debt);
    } else {
      setFormData({
        description: '',
        creditor: '',
        type: '',
        monthReference: new Date().toISOString().slice(0, 7).split('-').reverse().join('/'),
        totalValue: 0,
        monthlyValue: 0,
        installmentsPaid: 0,
        installmentsTotal: 1,
        status: 'PENDING',
      });
      setCurrentDebt(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta dívida?')) {
      actions.deleteDebt(id);
    }
  };

  const handleSave = () => {
    if (!formData.description || !formData.totalValue) return alert('Preencha os campos obrigatórios');

    const newDebt: Debt = {
      id: currentDebt?.id || crypto.randomUUID(),
      description: formData.description || '',
      creditor: formData.creditor || '',
      type: formData.type || '',
      monthReference: formData.monthReference || '',
      totalValue: Number(formData.totalValue),
      monthlyValue: Number(formData.monthlyValue),
      installmentsPaid: Number(formData.installmentsPaid),
      installmentsTotal: Number(formData.installmentsTotal),
      status: formData.status as PaymentStatus || 'PENDING',
    };

    if (currentDebt) {
      actions.updateDebt(newDebt);
    } else {
      actions.addDebt(newDebt);
    }
    
    setIsModalOpen(false);
  };

  const toggleStatus = (debt: Debt) => {
      actions.toggleDebtStatus(debt);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gerenciar Dívidas</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Dívida
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Credor</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Ref.</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Mensal</th>
                <th className="px-4 py-3 text-center">Parcelas</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {debts.length === 0 ? (
                <tr><td colSpan={9} className="p-4 text-center text-slate-500">Nenhuma dívida cadastrada.</td></tr>
              ) : debts.map((debt) => (
                <tr key={debt.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-medium">{debt.description}</td>
                  <td className="px-4 py-3">{debt.creditor}</td>
                  <td className="px-4 py-3">{debt.type}</td>
                  <td className="px-4 py-3">{debt.monthReference}</td>
                  <td className="px-4 py-3 text-right">R$ {debt.totalValue.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">R$ {debt.monthlyValue.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">{debt.installmentsPaid}/{debt.installmentsTotal}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                        onClick={() => toggleStatus(debt)}
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${debt.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {debt.status === 'PAID' ? 'Pago' : 'Aberto'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenModal(debt)} className="text-slate-500 hover:text-amber-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(debt.id)} className="text-slate-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentDebt ? "Editar Dívida" : "Nova Dívida"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <Input 
            label="Descrição" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Credor" 
              value={formData.creditor} 
              onChange={e => setFormData({...formData, creditor: e.target.value})} 
            />
             <Input 
              label="Tipo" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})} 
              placeholder="Ex: Cartão"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input 
              label="Mês Ref." 
              value={formData.monthReference} 
              onChange={e => setFormData({...formData, monthReference: e.target.value})} 
            />
            <Input 
              label="Valor Total" 
              type="number" 
              value={formData.totalValue} 
              onChange={e => setFormData({...formData, totalValue: Number(e.target.value)})} 
            />
            <Input 
              label="Valor Mensal" 
              type="number" 
              value={formData.monthlyValue} 
              onChange={e => setFormData({...formData, monthlyValue: Number(e.target.value)})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <Input 
              label="Parcelas Pagas" 
              type="number" 
              value={formData.installmentsPaid} 
              onChange={e => setFormData({...formData, installmentsPaid: Number(e.target.value)})} 
            />
            <Input 
              label="Total Parcelas" 
              type="number" 
              value={formData.installmentsTotal} 
              onChange={e => setFormData({...formData, installmentsTotal: Number(e.target.value)})} 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DividasPage;