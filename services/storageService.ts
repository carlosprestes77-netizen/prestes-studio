import { Transaction, Debt, AppConfig } from '../types';
import { defaultConfig } from '../theme';

const KEYS = {
  TRANSACTIONS: 'prestes_transactions',
  DEBTS: 'prestes_debts',
  CONFIG: 'prestes_config',
};

// Helper to safely parse JSON
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
};

const safeStringify = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save to ${key}`, e);
  }
};

export const storageService = {
  // Transactions
  getTransactions: (): Transaction[] => {
    return safeParse<Transaction[]>(KEYS.TRANSACTIONS, []);
  },

  saveTransactions: (transactions: Transaction[]): void => {
    safeStringify(KEYS.TRANSACTIONS, transactions);
  },

  addTransaction: (transaction: Transaction): void => {
    const current = storageService.getTransactions();
    safeStringify(KEYS.TRANSACTIONS, [...current, transaction]);
  },

  // Debts
  getDebts: (): Debt[] => {
    return safeParse<Debt[]>(KEYS.DEBTS, []);
  },

  saveDebts: (debts: Debt[]): void => {
    safeStringify(KEYS.DEBTS, debts);
  },

  addDebt: (debt: Debt): void => {
    const current = storageService.getDebts();
    safeStringify(KEYS.DEBTS, [...current, debt]);
  },

  // Config
  getConfig: (): AppConfig => {
    return safeParse<AppConfig>(KEYS.CONFIG, defaultConfig as AppConfig);
  },

  saveConfig: (config: AppConfig): void => {
    safeStringify(KEYS.CONFIG, config);
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(KEYS.TRANSACTIONS);
    localStorage.removeItem(KEYS.DEBTS);
    localStorage.removeItem(KEYS.CONFIG);
  }
};