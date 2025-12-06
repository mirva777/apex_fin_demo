'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Payment } from '@/lib/types';
import { formatAmount } from '@/lib/intentParser';

interface HistoryListProps {
  payments: Payment[];
}

export default function HistoryList({ payments }: HistoryListProps) {
  if (payments.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Recent Payments</h3>
      </div>
      
      <div className="space-y-3">
        {payments.slice(0, 5).map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-background-light rounded-xl p-3 border border-primary/10 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{payment.provider.icon}</span>
                <div>
                  <p className="text-sm font-medium">{payment.provider.name}</p>
                  <p className="text-xs text-text-muted">
                    {payment.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">
                  {formatAmount(payment.amount)}
                </p>
                <p className="text-xs text-text-muted">{payment.currency}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
