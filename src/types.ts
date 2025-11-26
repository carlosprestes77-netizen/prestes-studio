export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL';

export interface StatusHistory {
  date: string;
  status: PaymentStatus;
  note?: string;
}

export interface FinancialEvent {
  id: string;
  name: string;
  clientOrigin: string; // Cliente
  type: string; // Ex: Ensaio, Casamento, Corporativo
  monthReference: string; // MM/YYYY (Mantido para compatibilidade com Dashboard)
  
  // Novos campos para o Calendário
  date?: string; // ISO Date YYYY-MM-DD
  location?: string;
  time?: string;
  description?: string;

  totalValue: number;
  monthlyValue: number;
  status: PaymentStatus;
  history: StatusHistory[];
}

export interface Debt {
  id: string;
  description: string;
  creditor: string;
  type: string;
  monthReference: string;
  totalValue: number;
  monthlyValue: number;
  installmentsPaid: number;
  installmentsTotal: number;
  status: PaymentStatus;
}

export interface AppConfig {
  theme: 'light' | 'dark';
  monthlyBudgetLimit: number;
  userName: string;
}

export interface StorageData {
  events: FinancialEvent[];
  debts: Debt[];
  config: AppConfig;
}