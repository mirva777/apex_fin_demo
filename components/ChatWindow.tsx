'use client';

import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Message } from '@/lib/types';
import MessageBubble from './MessageBubble';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  interimTranscript?: string;
}

export default function ChatWindow({ messages, interimTranscript }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-primary/20">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Conversation</h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-2"
      >
        {messages.length === 0 && !interimTranscript && (
          <div className="flex items-center justify-center h-full text-text-muted text-center">
            <div>
              <p className="mb-2">👋 Hello! I'm your voice payment assistant.</p>
              <p className="text-sm">Tap the microphone and say something like:</p>
              <p className="text-xs mt-2 text-primary">"Pay for food 250 thousand so'm"</p>
              <p className="text-xs mt-1 text-primary">"Pay gas bill 120 thousand"</p>
            </div>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {interimTranscript && (
          <div className="flex justify-end mb-4">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary/50 text-background">
              <p className="text-sm leading-relaxed italic">{interimTranscript}...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
