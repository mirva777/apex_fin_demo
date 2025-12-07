'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background-light to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-20"
        >
          <div className="flex items-center gap-2">
            <Mic className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">OvozPay AI</h1>
          </div>
          <Link href="/ovozpay">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-background px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Try Demo
            </motion.button>
          </Link>
        </motion.nav>

        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Pay Your Bills with
              <br />
              <span className="gradient-text">Your Voice</span>
            </h2>
            <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
              AI-powered voice assistant that makes payments simple and accessible for everyone. 
              Just speak what you want to pay for, and we'll handle the rest.
            </p>
            <Link href="/ovozpay">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-background px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2 glow"
              >
                Try Live Demo
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-background-card rounded-3xl p-8 border border-primary/20 shadow-2xl"
          >
            <div className="aspect-video bg-background rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-slow" />
              <div className="relative z-10">
                <Mic className="w-20 h-20 text-primary mb-4 mx-auto" />
                <p className="text-text-muted">Voice-powered payment experience</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20"
        >
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="AI-Powered"
            description="Smart recognition understands natural language in English and Russian. Pay for anything!"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="100% Free"
            description="No paid APIs, no cloud dependencies. Everything runs in your browser."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Lightning Fast"
            description="Instant voice recognition and real-time payment processing simulation."
          />
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="space-y-8">
            <Step
              number="1"
              title="Tap the Microphone"
              description="Click the glowing mic button and start speaking."
            />
            <Step
              number="2"
              title="Say What You Want"
              description="Tell us what to pay: 'Pay for food 250 thousand' or 'Send money to Ali 50 thousand'"
            />
            <Step
              number="3"
              title="Confirm Payment"
              description="Review the details and say 'confirm' to proceed."
            />
            <Step
              number="4"
              title="Done!"
              description="Get your receipt instantly and download it for your records."
            />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-4xl mx-auto mt-20 text-center bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl p-12 border border-primary/30"
        >
          <h3 className="text-4xl font-bold mb-4">Ready to Try?</h3>
          <p className="text-xl text-text-muted mb-8">
            Experience the future of voice-powered payments
          </p>
          <Link href="/ovozpay">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-secondary text-background px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-primary/50 transition-all inline-flex items-center gap-2 glow"
            >
              Launch Demo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 text-center text-text-muted">
          <p className="text-sm">
            OvozPay AI - Voice Payment Assistant Demo © 2025
          </p>
          <p className="text-xs mt-2">
            All payments are simulated for demonstration purposes only.
          </p>
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-background-card rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all"
    >
      <div className="text-primary mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-text-muted text-sm">{description}</p>
    </motion.div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-background flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-semibold mb-2">{title}</h4>
        <p className="text-text-muted">{description}</p>
      </div>
    </div>
  );
}
