'use client';

import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { PaymentStep } from '@/lib/types';

interface PaymentTimelineProps {
  steps: PaymentStep[];
}

export default function PaymentTimeline({ steps }: PaymentTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4"
        >
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              step.status === 'completed'
                ? 'bg-primary border-primary'
                : step.status === 'active'
                ? 'bg-primary/20 border-primary animate-pulse'
                : 'bg-background-light border-text-muted/30'
            }`}
          >
            {step.status === 'completed' && (
              <Check className="w-5 h-5 text-background" />
            )}
            {step.status === 'active' && (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            )}
            {step.status === 'pending' && (
              <span className="text-text-muted text-sm">{step.id}</span>
            )}
          </div>
          
          <div className="flex-1">
            <p
              className={`font-medium transition-colors ${
                step.status === 'completed' || step.status === 'active'
                  ? 'text-text'
                  : 'text-text-muted'
              }`}
            >
              {step.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
