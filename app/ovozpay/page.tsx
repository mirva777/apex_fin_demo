'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Message, Payment, PaymentStep, IntentResult } from '@/lib/types';
import { parseIntent, isConfirmation, generateResponse } from '@/lib/intentParser';
import MicButton from '@/components/MicButton';
import ChatWindow from '@/components/ChatWindow';
import PaymentPanel from '@/components/PaymentPanel';

export default function OvozPayDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<IntentResult | null>(null);
  const [waitingForAmount, setWaitingForAmount] = useState(false);
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([
    { id: 1, label: 'Connecting to bank...', status: 'pending' },
    { id: 2, label: 'Verifying account...', status: 'pending' },
    { id: 3, label: 'Processing payment...', status: 'pending' },
    { id: 4, label: 'Payment successful 🎉', status: 'pending' },
  ]);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: speechRecognitionSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const { speak, isSupported: speechSynthesisSupported } = useSpeechSynthesis();

  const addMessage = useCallback((text: string, type: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    
    if (type === 'assistant' && speechSynthesisSupported) {
      // Speak the assistant's message
      setTimeout(() => speak(text), 300);
    }
  }, [speak, speechSynthesisSupported]);

  const resetPaymentSteps = useCallback(() => {
    setPaymentSteps([
      { id: 1, label: 'Connecting to bank...', status: 'pending' },
      { id: 2, label: 'Verifying account...', status: 'pending' },
      { id: 3, label: 'Processing payment...', status: 'pending' },
      { id: 4, label: 'Payment successful 🎉', status: 'pending' },
    ]);
  }, []);

  const processPayment = useCallback(async (payment: Payment) => {
    setIsProcessing(true);
    resetPaymentSteps();

    // Animate through payment steps
    const steps = [
      { id: 1, label: 'Connecting to bank...', status: 'active' as const },
      { id: 2, label: 'Verifying account...', status: 'pending' as const },
      { id: 3, label: 'Processing payment...', status: 'pending' as const },
      { id: 4, label: 'Payment successful 🎉', status: 'pending' as const },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setPaymentSteps((prev) => {
        const updated = [...prev];
        if (i > 0) {
          updated[i - 1].status = 'completed';
        }
        updated[i].status = 'active';
        return updated;
      });
    }

    // Final step completion
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPaymentSteps((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].status = 'completed';
      return updated;
    });

    // Generate transaction ID
    const transactionId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const completedPmt: Payment = {
      ...payment,
      status: 'success',
      transactionId,
      date: new Date(),
    };

    setIsProcessing(false);
    setCompletedPayment(completedPmt);
    setPaymentHistory((prev) => [completedPmt, ...prev]);
    setCurrentPayment(null);
    setPendingIntent(null);
    setWaitingForAmount(false);

    addMessage(
      `Payment successful! Your ${payment.provider.name} bill has been paid. Transaction ID: ${transactionId}`,
      'assistant'
    );
  }, [addMessage, resetPaymentSteps]);

  const handleTranscript = useCallback((finalTranscript: string) => {
    if (!finalTranscript.trim()) return;

    addMessage(finalTranscript, 'user');

    // Check if this is a confirmation
    if (pendingIntent && isConfirmation(finalTranscript)) {
      const response = generateResponse(pendingIntent, 'confirmation');
      addMessage(response, 'assistant');

      // Create payment object
      const payment: Payment = {
        id: Date.now().toString(),
        provider: pendingIntent.provider!,
        amount: pendingIntent.amount!,
        currency: "so'm",
        date: new Date(),
        status: 'pending',
      };

      setCurrentPayment(payment);
      setWaitingForAmount(false);
      processPayment(payment);
      return;
    }

    // Check if we're waiting for an amount and user just said a number
    if (waitingForAmount && pendingIntent) {
      // Try to parse amount from the transcript
      const lowerText = finalTranscript.toLowerCase();
      let amount: number | null = null;
      
      // Try to extract numeric amount
      const numericMatch = lowerText.match(/(\d+[\s,]*\d*)/);
      if (numericMatch) {
        amount = parseInt(numericMatch[1].replace(/[\s,]/g, ''), 10);
      }
      
      // Check for text numbers like "120 ming" (120 thousand)
      const mingMatch = lowerText.match(/(\d+)[\s]*(ming|thousand|тысяч)/);
      if (mingMatch) {
        amount = parseInt(mingMatch[1], 10) * 1000;
      }
      
      if (amount) {
        // Update the pending intent with the amount
        const updatedIntent: IntentResult = {
          ...pendingIntent,
          amount,
        };
        
        const response = generateResponse(updatedIntent, 'initial');
        addMessage(response, 'assistant');
        setPendingIntent(updatedIntent);
        setWaitingForAmount(false);
        
        // Set up the payment preview
        const payment: Payment = {
          id: Date.now().toString(),
          provider: updatedIntent.provider!,
          amount: amount,
          currency: "so'm",
          date: new Date(),
          status: 'pending',
        };
        setCurrentPayment(payment);
        setCompletedPayment(null);
        return;
      }
    }

    // Parse new intent
    const intent = parseIntent(finalTranscript);

    if (intent.billType === 'unknown') {
      addMessage(generateResponse(intent, 'initial'), 'assistant');
      setWaitingForAmount(false);
      return;
    }

    if (!intent.provider) {
      addMessage(generateResponse(intent, 'initial'), 'assistant');
      setWaitingForAmount(false);
      return;
    }

    if (!intent.amount) {
      addMessage(
        `I understand you want to pay for ${intent.provider.name}. How much would you like to pay?`,
        'assistant'
      );
      setPendingIntent(intent);
      setWaitingForAmount(true);
      return;
    }

    // We have everything, ask for confirmation
    const response = generateResponse(intent, 'initial');
    addMessage(response, 'assistant');
    setPendingIntent(intent);
    setWaitingForAmount(false);

    // Set up the payment preview
    const payment: Payment = {
      id: Date.now().toString(),
      provider: intent.provider,
      amount: intent.amount,
      currency: "so'm",
      date: new Date(),
      status: 'pending',
    };
    setCurrentPayment(payment);
    setCompletedPayment(null);
  }, [addMessage, pendingIntent, processPayment, waitingForAmount]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening(handleTranscript);
    }
  }, [isListening, startListening, stopListening, handleTranscript]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage(
        "Hello! I'm your voice payment assistant. Tell me what you'd like to pay for. You can pay for anything - gas, electricity, food, rent, shopping, or anything else!",
        'assistant'
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [addMessage]);

  if (!speechRecognitionSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Speech Recognition Not Supported</h2>
          <p className="text-text-muted mb-6">
            Your browser doesn't support the Web Speech API. Please use Chrome, Edge, or Safari.
          </p>
          <Link href="/">
            <button className="bg-primary text-background px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          <h1 className="text-xl font-bold gradient-text">OvozPay AI Demo</h1>
          <div className="w-20" /> {/* Spacer for center alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="flex-1 grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Chat */}
          <div className="bg-background-card rounded-3xl p-6 border border-primary/20 flex flex-col h-[calc(100vh-250px)] lg:h-auto">
            <ChatWindow messages={messages} interimTranscript={interimTranscript} />
          </div>

          {/* Right: Payment Panel */}
          <div className="bg-background-card rounded-3xl p-6 border border-primary/20 flex flex-col h-[calc(100vh-250px)] lg:h-auto">
            <PaymentPanel
              currentPayment={currentPayment}
              paymentSteps={paymentSteps}
              completedPayment={completedPayment}
              paymentHistory={paymentHistory}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Mic Button */}
        <div className="flex justify-center">
          <MicButton
            isListening={isListening}
            onClick={handleMicClick}
            disabled={isProcessing}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-background-card/50 backdrop-blur py-4">
        <div className="container mx-auto px-4 text-center text-text-muted text-sm">
          <p>Try saying: "Pay for food 250 thousand so'm" or "Pay gas bill 120 thousand" or "Pay rent same as last time"</p>
        </div>
      </footer>
    </div>
  );
}
