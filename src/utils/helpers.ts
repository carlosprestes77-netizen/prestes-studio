
import { FinancialEvent, Debt } from '../types';

/**
 * Formata um valor numérico para o formato de moeda Real Brasileiro (BRL).
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Gera uma string de referência de mês (MM/YYYY) baseada na data atual ou fornecida.
 */
export const generateMonthReference = (date: Date = new Date()): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${year}`;
};

/**
 * Ordena um array de referências de mês (MM/YYYY) cronologicamente.
 */
export const sortMonthReferences = (months: string[]): string[] => {
  return months.sort((a, b) => {
    const [ma, ya] = a.split('/').map(Number);
    const [mb, yb] = b.split('/').map(Number);
    return ya - yb || ma - mb;
  });
};

export interface MonthlySummary {
  month: string;
  totalEvents: number;
  received: number;
  receivable: number;
  totalDebts: number;
  debtsPaid: number;
  debtsOpen: number;
}

/**
 * Calcula o resumo financeiro mensal para alimentar a matriz da Dashboard.
 */
export const calculateMonthlySummary = (
  events: FinancialEvent[],
  debts: Debt[]
): MonthlySummary[] => {
  const monthsSet = new Set<string>();
  events.forEach((e) => monthsSet.add(e.monthReference));
  debts.forEach((d) => monthsSet.add(d.monthReference));

  const sortedMonths = sortMonthReferences(Array.from(monthsSet));

  return sortedMonths.map((month) => {
    const monthEvents = events.filter((e) => e.monthReference === month);
    const monthDebts = debts.filter((d) => d.monthReference === month);

    // Regra para recebidos: Soma total se PAGO, metade se PARCIAL (estimativa simples)
    const received =
      monthEvents
        .filter((e) => e.status === 'PAID')
        .reduce((acc, curr) => acc + curr.monthlyValue, 0) +
      monthEvents
        .filter((e) => e.status === 'PARTIAL')
        .reduce((acc, curr) => acc + curr.monthlyValue / 2, 0);

    const receivable = monthEvents
      .filter((e) => e.status === 'PENDING')
      .reduce((acc, curr) => acc + curr.monthlyValue, 0);

    const debtsPaid = monthDebts
      .filter((d) => d.status === 'PAID')
      .reduce((acc, curr) => acc + curr.monthlyValue, 0);

    const debtsOpen = monthDebts
      .filter((d) => d.status !== 'PAID')
      .reduce((acc, curr) => acc + curr.monthlyValue, 0);

    return {
      month,
      totalEvents: monthEvents.reduce((acc, curr) => acc + curr.totalValue, 0),
      received,
      receivable,
      totalDebts: monthDebts.reduce((acc, curr) => acc + curr.totalValue, 0),
      debtsPaid,
      debtsOpen,
    };
  });
};
