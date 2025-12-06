'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function MicButton({ isListening, onClick, disabled }: MicButtonProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening 
            ? 'bg-gradient-to-br from-primary to-secondary glow animate-glow-pulse' 
            : 'bg-background-card hover:bg-primary/20 border border-primary/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={isListening ? {
          boxShadow: [
            '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2)',
            '0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.3)',
            '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2)',
          ]
        } : {}}
        transition={isListening ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {}}
      >
        {isListening ? (
          <Mic className="w-10 h-10 text-background" />
        ) : (
          <MicOff className="w-10 h-10 text-primary" />
        )}
        
        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.button>
      
      <p className="text-text-muted text-sm">
        {isListening ? 'Listening...' : 'Tap to speak'}
      </p>
      
      {/* Equalizer animation when listening */}
      {isListening && (
        <div className="flex gap-1 h-8 items-end">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-primary rounded-full"
              animate={{
                height: ['8px', '32px', '8px'],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
