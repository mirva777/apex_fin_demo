import { Provider, BillType } from './types';

export const PROVIDERS: Provider[] = [
  { id: 'uzgas', name: 'UzGas', billType: 'gas', icon: '🔥' },
  { id: 'uzelectric', name: 'UzElectric', billType: 'electricity', icon: '⚡' },
  { id: 'ucell', name: 'Ucell', billType: 'mobile', icon: '📱' },
  { id: 'beeline', name: 'Beeline', billType: 'mobile', icon: '📱' },
  { id: 'uztelecom', name: 'UzTelecom', billType: 'internet', icon: '🌐' },
  { id: 'perfectum', name: 'Perfectum', billType: 'internet', icon: '🌐' },
  { id: 'uzwater', name: 'UzWater', billType: 'water', icon: '💧' },
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
