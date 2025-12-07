import { IntentResult, BillType, Provider } from './types';
import { PROVIDERS, getLastPaymentAmount } from './mockPayments';

// Keywords for different bill types in multiple languages
const BILL_TYPE_KEYWORDS: Record<BillType, string[]> = {
  gas: ['gas', 'gaz', 'газ', 'uzgas'],
  electricity: ['electricity', 'electric', 'elektr', 'ток', 'uzelectric', 'свет'],
  mobile: ['mobile', 'phone', 'telefon', 'телефон', 'ucell', 'beeline'],
  internet: ['internet', 'интернет', 'wifi', 'uztelecom', 'perfectum'],
  water: ['water', 'suv', 'вода', 'uzwater'],
  food: ['food', 'groceries', 'grocery', 'еда', 'продукты', 'ovqat'],
  rent: ['rent', 'rental', 'квартира', 'apartment', 'ijara', 'house'],
  shopping: ['shopping', 'shop', 'store', 'покупки', 'xarid'],
  transport: ['transport', 'taxi', 'bus', 'транспорт', 'transport'],
  entertainment: ['entertainment', 'movie', 'cinema', 'развлечения', 'ko\'ngilochar'],
  healthcare: ['health', 'healthcare', 'doctor', 'hospital', 'медицина', 'shifokor'],
  education: ['education', 'school', 'university', 'образование', 'ta\'lim'],
  transfer: ['send', 'transfer', 'yuborish', 'jo\'natish', 'перевести', 'отправить'],
  other: [],
  unknown: [],
};

// Confirmation keywords
const CONFIRMATION_KEYWORDS = [
  'yes', 'ha', 'tasdiqlayman', 'confirm', 'ok', 'okay', 'да', 'давай',
  'tasdiq', 'toʻlash', 'pay', 'платить', 'оплатить'
];

// "Same as last" keywords
const SAME_AS_LAST_KEYWORDS = [
  'same', 'last', 'oldingi', 'oxirgi', 'previous', 'предыдущий', 'как прошлый раз',
  'oldingi sum', 'last time', 'kabi'
];

// Number parsing helpers
const NUMBER_WORDS: Record<string, number> = {
  'bir': 1, 'ikki': 2, 'uch': 3, 'tort': 4, 'besh': 5,
  'olti': 6, 'yetti': 7, 'sakkiz': 8, 'toqqiz': 9, 'on': 10,
  'yigirma': 20, 'ottiz': 30, 'qirq': 40, 'ellik': 50,
  'oltmish': 60, 'yetmish': 70, 'sakson': 80, 'toqson': 90,
  'yuz': 100, 'ming': 1000, 'million': 1000000,
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
  'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
  'hundred': 100, 'thousand': 1000,
  'один': 1, 'два': 2, 'три': 3, 'четыре': 4, 'пять': 5,
  'сто': 100, 'тысяча': 1000,
};

export function parseIntent(text: string): IntentResult {
  const lowerText = text.toLowerCase();
  
  // Detect bill type
  let billType: BillType = 'unknown';
  let recipientName: string | null = null;
  
  for (const [type, keywords] of Object.entries(BILL_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      billType = type as BillType;
      
      // Extract recipient name for transfers
      if (billType === 'transfer') {
        const sendToMatch = text.match(/(?:send|transfer|yuborish|jo'natish|перевести|отправить)\s+(?:money\s+)?to\s+(\w+)/i);
        if (sendToMatch && sendToMatch[1]) {
          recipientName = sendToMatch[1].charAt(0).toUpperCase() + sendToMatch[1].slice(1).toLowerCase();
        }
      }
      break;
    }
  }
  
  // If no specific keywords found but contains "pay" or "bill", try to extract a custom category
  if (billType === 'unknown' && (lowerText.includes('pay') || lowerText.includes('bill') || lowerText.includes('платить') || lowerText.includes('to\'lash'))) {
    // Check if there's a word after "pay" or "for" that could be a category
    const payForMatch = lowerText.match(/(?:pay|for|bill)\s+(?:for\s+)?(\w+)/);
    if (payForMatch && payForMatch[1]) {
      // Create a custom provider for this category
      billType = 'other';
    }
  }
  
  // Get provider
  let provider: Provider | null = null;
  
  if (billType !== 'unknown') {
    provider = PROVIDERS.find(p => p.billType === billType) || null;
    
    // Create dynamic provider for transfers with recipient name
    if (billType === 'transfer' && recipientName) {
      provider = {
        id: `transfer_${recipientName.toLowerCase()}`,
        name: recipientName,
        billType: 'transfer',
        icon: '💸'
      };
    }
    
    // If no provider found for this bill type, create a dynamic one
    if (!provider && billType === 'other') {
      const payForMatch = lowerText.match(/(?:pay|for|bill)\s+(?:for\s+)?(\w+)/);
      if (payForMatch && payForMatch[1]) {
        const category = payForMatch[1].charAt(0).toUpperCase() + payForMatch[1].slice(1);
        provider = {
          id: payForMatch[1].toLowerCase(),
          name: category,
          billType: 'other',
          icon: '💳'
        };
      }
    }
  }
  
  // Check for "same as last"
  const sameAsLast = SAME_AS_LAST_KEYWORDS.some(keyword => 
    lowerText.includes(keyword)
  );
  
  // Parse amount
  let amount: number | null = null;
  
  // Try to extract numeric amount
  const numericMatch = lowerText.match(/(\d+[\s,]*\d*)/);
  if (numericMatch) {
    amount = parseInt(numericMatch[1].replace(/[\s,]/g, ''), 10);
  }
  
  // Check for text numbers like "120 ming" (120 thousand)
  const mingMatch = lowerText.match(/(\d+)[\s]*(ming|thousand|тысяч)/);
  if (mingMatch && !amount) {
    amount = parseInt(mingMatch[1], 10) * 1000;
  }
  
  // If "same as last", get the last payment amount
  if (sameAsLast && provider && !amount) {
    const lastAmount = getLastPaymentAmount(provider.id);
    if (lastAmount) {
      amount = lastAmount;
    }
  }
  
  // Determine if confirmation is needed
  const isConfirmation = CONFIRMATION_KEYWORDS.some(keyword => 
    lowerText.includes(keyword)
  );
  
  return {
    billType,
    provider,
    amount,
    sameAsLast,
    needsConfirmation: !isConfirmation && billType !== 'unknown',
  };
}

export function isConfirmation(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CONFIRMATION_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

export function generateResponse(intent: IntentResult, phase: 'initial' | 'confirmation'): string {
  if (phase === 'initial') {
    if (intent.billType === 'unknown') {
      return "I couldn't understand what you want to do. Please say something like 'pay for food', 'pay gas bill', or 'send money to Ali'.";
    }
    
    if (!intent.provider) {
      if (intent.billType === 'transfer') {
        return "I couldn't detect who you want to send money to. Please say something like 'send money to Ali' or 'transfer 50000 to John'.";
      }
      return `I detected you want to pay for ${intent.billType}, but I couldn't find the details. Please try again.`;
    }
    
    if (intent.billType === 'transfer') {
      if (intent.amount) {
        return `Okay, I'll send ${formatAmount(intent.amount)} so'm to ${intent.provider.name}. Please say 'confirm' to continue.`;
      }
      return `I understand you want to send money to ${intent.provider.name}. How much would you like to send?`;
    }
    
    if (intent.sameAsLast && intent.amount) {
      return `I found your last ${intent.provider.name} payment for ${formatAmount(intent.amount)} so'm. Say 'confirm' to proceed with the payment.`;
    }
    
    if (intent.amount) {
      return `Okay, I'll pay ${formatAmount(intent.amount)} so'm for ${intent.provider.name}. Please say 'confirm' to continue.`;
    }
    
    return `I understand you want to pay for ${intent.provider.name}. How much would you like to pay?`;
  } else {
    if (intent.billType === 'transfer') {
      return `Great! Sending ${formatAmount(intent.amount || 0)} so'm to ${intent.provider?.name}...`;
    }
    return `Great! Processing your payment for ${intent.provider?.name} for ${formatAmount(intent.amount || 0)} so'm...`;
  }
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US');
}
