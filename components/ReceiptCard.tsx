'use client';

import { motion } from 'framer-motion';
import { Download, CheckCircle } from 'lucide-react';
import { Payment } from '@/lib/types';
import { formatAmount } from '@/lib/intentParser';

interface ReceiptCardProps {
  payment: Payment;
}

export default function ReceiptCard({ payment }: ReceiptCardProps) {
  const handleDownload = () => {
    // Create a simple receipt as a text file
    const receiptText = `
=================================
        PAYMENT RECEIPT
=================================

Provider: ${payment.provider.name}
Amount: ${formatAmount(payment.amount)} ${payment.currency}
Date: ${payment.date.toLocaleDateString('en-US')}
Time: ${payment.date.toLocaleTimeString('en-US')}
Transaction ID: ${payment.transactionId}
Status: ${payment.status.toUpperCase()}

=================================
        Thank You!
=================================
    `.trim();
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background-card rounded-2xl p-6 border border-primary/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Payment Receipt</h3>
        <CheckCircle className="w-6 h-6 text-primary" />
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{payment.provider.icon}</span>
          <div>
            <p className="font-medium">{payment.provider.name}</p>
            <p className="text-xs text-text-muted capitalize">{payment.provider.billType} Bill</p>
          </div>
        </div>
        
        <div className="h-px bg-primary/20" />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted mb-1">Amount</p>
            <p className="text-xl font-bold text-primary">
              {formatAmount(payment.amount)} {payment.currency}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-text-muted mb-1">Status</p>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Success
            </span>
          </div>
        </div>
        
        <div>
          <p className="text-xs text-text-muted mb-1">Transaction ID</p>
          <p className="text-sm font-mono">{payment.transactionId}</p>
        </div>
        
        <div>
          <p className="text-xs text-text-muted mb-1">Date & Time</p>
          <p className="text-sm">
            {payment.date.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })} at {payment.date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleDownload}
        className="w-full bg-primary hover:bg-primary-dark text-background font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Receipt
      </button>
    </motion.div>
  );
}
