export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO String
  type: TransactionType;
  category: string;
}

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  dueDate: string; // ISO String
  isPaid: boolean;
  description?: string;
}

export interface AppConfig {
  theme: 'light' | 'dark';
  monthlyBudgetLimit: number;
  userName: string;
}

export interface StorageData {
  transactions: Transaction[];
  debts: Debt[];
  config: AppConfig;
}