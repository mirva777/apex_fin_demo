'use client';

import { motion } from 'framer-motion';
import { CreditCard, AlertCircle } from 'lucide-react';
import { Payment, PaymentStep } from '@/lib/types';
import { formatAmount } from '@/lib/intentParser';
import PaymentTimeline from './PaymentTimeline';
import ReceiptCard from './ReceiptCard';
import HistoryList from './HistoryList';

interface PaymentPanelProps {
  currentPayment: Payment | null;
  paymentSteps: PaymentStep[];
  completedPayment: Payment | null;
  paymentHistory: Payment[];
  isProcessing: boolean;
}

export default function PaymentPanel({ 
  currentPayment, 
  paymentSteps, 
  completedPayment,
  paymentHistory,
  isProcessing 
}: PaymentPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
        <CreditCard className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Payment Details</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {!currentPayment && !completedPayment && !isProcessing && (
          <div className="flex items-center justify-center h-full text-text-muted text-center">
            <div>
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active payment</p>
              <p className="text-sm mt-2">Start a conversation to make a payment</p>
            </div>
          </div>
        )}
        
        {currentPayment && !completedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-background-card rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{currentPayment.provider.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{currentPayment.provider.name}</h3>
                  <p className="text-sm text-text-muted capitalize">
                    {currentPayment.provider.billType} Bill
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-sm text-text-muted mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-primary">
                  {formatAmount(currentPayment.amount)} {currentPayment.currency}
                </p>
              </div>
            </div>
            
            {isProcessing && (
              <div className="bg-background-card rounded-2xl p-6 border border-primary/20">
                <h3 className="text-lg font-semibold mb-4">Processing Payment</h3>
                <PaymentTimeline steps={paymentSteps} />
              </div>
            )}
          </motion.div>
        )}
        
        {completedPayment && (
          <div className="space-y-6">
            <ReceiptCard payment={completedPayment} />
            <HistoryList payments={paymentHistory} />
          </div>
        )}
        
        {!completedPayment && !isProcessing && paymentHistory.length > 0 && (
          <HistoryList payments={paymentHistory} />
        )}
      </div>
    </div>
  );
}
