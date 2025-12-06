import { Provider, BillType } from './types';

export const PROVIDERS: Provider[] = [
  { id: 'uzgas', name: 'UzGas', billType: 'gas', icon: '🔥' },
  { id: 'uzelectric', name: 'UzElectric', billType: 'electricity', icon: '⚡' },
  { id: 'ucell', name: 'Ucell', billType: 'mobile', icon: '📱' },
  { id: 'beeline', name: 'Beeline', billType: 'mobile', icon: '📱' },
  { id: 'uztelecom', name: 'UzTelecom', billType: 'internet', icon: '🌐' },
  { id: 'perfectum', name: 'Perfectum', billType: 'internet', icon: '🌐' },
  { id: 'uzwater', name: 'UzWater', billType: 'water', icon: '💧' },
  { id: 'food', name: 'Food & Groceries', billType: 'food', icon: '🍔' },
  { id: 'rent', name: 'Rent Payment', billType: 'rent', icon: '🏠' },
  { id: 'shopping', name: 'Shopping', billType: 'shopping', icon: '🛍️' },
  { id: 'transport', name: 'Transportation', billType: 'transport', icon: '🚗' },
  { id: 'entertainment', name: 'Entertainment', billType: 'entertainment', icon: '🎬' },
  { id: 'healthcare', name: 'Healthcare', billType: 'healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', billType: 'education', icon: '📚' },
];

// Mock database of last payments per provider
export const LAST_PAYMENTS: Record<string, { amount: number; date: Date }> = {
  uzgas: { amount: 120000, date: new Date('2024-11-15') },
  uzelectric: { amount: 85000, date: new Date('2024-11-18') },
  ucell: { amount: 50000, date: new Date('2024-11-20') },
  beeline: { amount: 45000, date: new Date('2024-11-22') },
  uztelecom: { amount: 100000, date: new Date('2024-11-10') },
  perfectum: { amount: 150000, date: new Date('2024-11-12') },
  uzwater: { amount: 35000, date: new Date('2024-11-14') },
  food: { amount: 250000, date: new Date('2024-11-16') },
  rent: { amount: 3000000, date: new Date('2024-11-01') },
  shopping: { amount: 180000, date: new Date('2024-11-19') },
  transport: { amount: 75000, date: new Date('2024-11-21') },
  entertainment: { amount: 150000, date: new Date('2024-11-17') },
  healthcare: { amount: 200000, date: new Date('2024-11-13') },
  education: { amount: 500000, date: new Date('2024-11-05') },
};

export function getProviderByType(billType: BillType): Provider | null {
  const provider = PROVIDERS.find(p => p.billType === billType);
  return provider || null;
}

export function getProviderById(id: string): Provider | null {
  return PROVIDERS.find(p => p.id === id) || null;
}

export function getLastPaymentAmount(providerId: string): number | null {
  return LAST_PAYMENTS[providerId]?.amount || null;
}
