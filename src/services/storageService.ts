import { FinancialEvent, Debt, AppConfig } from '../types';
import { defaultConfig } from '../theme';

const KEYS = {
  EVENTS: 'prestes_events',
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
    // Dispara evento para atualizar componentes que ouvem mudanças
    window.dispatchEvent(new Event('storage-update'));
  } catch (e) {
    console.error(`Failed to save to ${key}`, e);
  }
};

export const storageService = {
  // Events
  getEvents: (): FinancialEvent[] => {
    return safeParse<FinancialEvent[]>(KEYS.EVENTS, []);
  },

  saveEvents: (events: FinancialEvent[]): void => {
    safeStringify(KEYS.EVENTS, events);
  },

  addEvent: (event: FinancialEvent): void => {
    const current = storageService.getEvents();
    safeStringify(KEYS.EVENTS, [...current, event]);
  },

  updateEvent: (updatedEvent: FinancialEvent): void => {
    const current = storageService.getEvents();
    const newEvents = current.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    safeStringify(KEYS.EVENTS, newEvents);
  },

  deleteEvent: (id: string): void => {
    const current = storageService.getEvents();
    const newEvents = current.filter(e => e.id !== id);
    safeStringify(KEYS.EVENTS, newEvents);
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

  updateDebt: (updatedDebt: Debt): void => {
    const current = storageService.getDebts();
    const newDebts = current.map(d => d.id === updatedDebt.id ? updatedDebt : d);
    safeStringify(KEYS.DEBTS, newDebts);
  },

  deleteDebt: (id: string): void => {
    const current = storageService.getDebts();
    const newDebts = current.filter(d => d.id !== id);
    safeStringify(KEYS.DEBTS, newDebts);
  },

  // Config
  getConfig: (): AppConfig => {
    return safeParse<AppConfig>(KEYS.CONFIG, defaultConfig as AppConfig);
  },

  saveConfig: (config: AppConfig): void => {
    safeStringify(KEYS.CONFIG, config);
  },

  // Import/Export
  getAllData: () => {
    return {
      events: storageService.getEvents(),
      debts: storageService.getDebts(),
      config: storageService.getConfig(),
    };
  },

  importData: (data: any) => {
    if (data.events) storageService.saveEvents(data.events);
    if (data.debts) storageService.saveDebts(data.debts);
    if (data.config) storageService.saveConfig(data.config);
  },

  clearAll: (): void => {
    localStorage.removeItem(KEYS.EVENTS);
    localStorage.removeItem(KEYS.DEBTS);
    localStorage.removeItem(KEYS.CONFIG);
    window.dispatchEvent(new Event('storage-update'));
  }
};