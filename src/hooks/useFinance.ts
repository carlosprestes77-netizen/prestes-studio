
import { useState, useEffect, useMemo, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { FinancialEvent, Debt, PaymentStatus } from '../types';
import { calculateMonthlySummary } from '../utils/helpers';

export const useFinance = () => {
  const [events, setEvents] = useState<FinancialEvent[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  // Carrega dados do localStorage via service
  const loadData = useCallback(() => {
    setEvents(storageService.getEvents());
    setDebts(storageService.getDebts());
  }, []);

  // Efeito para carregar dados iniciais e ouvir mudanças no storage
  useEffect(() => {
    loadData();
    // O storageService dispara este evento customizado sempre que salva dados
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [loadData]);

  // Cálculos derivados (memoizados para performance)
  const stats = useMemo(() => {
    const grossIncome = events.reduce((acc, curr) => acc + curr.totalValue, 0);

    const receivedIncome = events.reduce((acc, curr) => {
      if (curr.status === 'PAID') return acc + curr.monthlyValue;
      if (curr.status === 'PARTIAL') return acc + (curr.monthlyValue / 2);
      return acc;
    }, 0);

    const receivableIncome = events
      .filter((e) => e.status === 'PENDING')
      .reduce((acc, curr) => acc + curr.monthlyValue, 0);

    const totalDebt = debts.reduce((acc, curr) => acc + curr.totalValue, 0);

    const paidDebt = debts
      .filter((d) => d.status === 'PAID')
      .reduce((acc, curr) => acc + curr.monthlyValue, 0);

    const openDebt = debts
      .filter((d) => d.status !== 'PAID')
      .reduce((acc, curr) => acc + curr.monthlyValue, 0);

    const monthlyMatrix = calculateMonthlySummary(events, debts);

    return {
      grossIncome,
      receivedIncome,
      receivableIncome,
      totalDebt,
      paidDebt,
      openDebt,
      monthlyMatrix,
    };
  }, [events, debts]);

  // Ações - Eventos
  const addEvent = (event: FinancialEvent) => storageService.addEvent(event);
  
  const updateEvent = (event: FinancialEvent) => storageService.updateEvent(event);
  
  const deleteEvent = (id: string) => storageService.deleteEvent(id);

  const updateEventStatus = (event: FinancialEvent, status: PaymentStatus) => {
    const updated: FinancialEvent = {
      ...event,
      status,
      history: [
        ...event.history,
        { date: new Date().toISOString(), status },
      ],
    };
    storageService.updateEvent(updated);
  };

  // Ações - Dívidas
  const addDebt = (debt: Debt) => storageService.addDebt(debt);
  
  const updateDebt = (debt: Debt) => storageService.updateDebt(debt);
  
  const deleteDebt = (id: string) => storageService.deleteDebt(id);

  const toggleDebtStatus = (debt: Debt) => {
    const newStatus: PaymentStatus = debt.status === 'PAID' ? 'PENDING' : 'PAID';
    storageService.updateDebt({ ...debt, status: newStatus });
  };

  return {
    events,
    debts,
    stats,
    actions: {
      addEvent,
      updateEvent,
      deleteEvent,
      updateEventStatus,
      addDebt,
      updateDebt,
      deleteDebt,
      toggleDebtStatus,
    },
  };
};
