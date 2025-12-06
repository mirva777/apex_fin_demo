export type BillType = 'gas' | 'electricity' | 'mobile' | 'internet' | 'water' | 'unknown';

export type Provider = {
  id: string;
  name: string;
  billType: BillType;
  icon: string;
};

export type Payment = {
  id: string;
  provider: Provider;
  amount: number;
  currency: string;
  date: Date;
  status: 'pending' | 'processing' | 'success' | 'failed';
  transactionId?: string;
};

export type IntentResult = {
  billType: BillType;
  provider: Provider | null;
  amount: number | null;
  sameAsLast: boolean;
  needsConfirmation: boolean;
};

export type Message = {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
};

export type PaymentStep = {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
};
