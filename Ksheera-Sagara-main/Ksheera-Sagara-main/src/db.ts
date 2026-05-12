import Dexie, { type Table } from 'dexie';

export interface MilkProduction {
  id?: number;
  date: string; // ISO format
  quantity: number; // liters
  fat: number;
  snf: number;
  ratePerLiter: number;
  totalIncome: number;
  cowId?: number;
}

export interface Expense {
  id?: number;
  date: string;
  category: 'Fodder' | 'Medical' | 'Labor' | 'Electricity' | 'Other';
  amount: number;
  description: string;
}

export interface Cow {
  id?: number;
  name: string;
  breed?: string;
  tagId?: string;
}

export class DairyDatabase extends Dexie {
  productions!: Table<MilkProduction>;
  expenses!: Table<Expense>;
  cows!: Table<Cow>;

  constructor() {
    super('KsheeraSagaraDB');
    this.version(1).stores({
      productions: '++id, date, cowId',
      expenses: '++id, date, category',
      cows: '++id, name, tagId'
    });
  }
}

export const db = new DairyDatabase();
