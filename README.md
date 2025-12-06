# 🎙️ OvozPay AI - Voice Payment Assistant

A fully client-side, production-ready voice payment assistant demo that allows users to pay bills using voice commands. Built with Next.js, TypeScript, and native Web Speech APIs.

![OvozPay AI](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🎤 **Voice-Powered**: Uses browser's native Web Speech API for speech recognition and synthesis
- 🌍 **Multi-Language Support**: Understands commands in Uzbek, Russian, and English
- 🤖 **Smart AI Logic**: Rule-based intent parsing that extracts bill types, amounts, and providers
- 💳 **Realistic Payment Flow**: Complete payment simulation with steps and receipt generation
- 🎨 **Beautiful UI**: Modern, dark-themed interface with smooth animations using Framer Motion
- 📱 **Fully Responsive**: Works perfectly on desktop and mobile devices
- 🆓 **100% Free**: No paid APIs, no cloud dependencies - everything runs in your browser
- 🚀 **Production Ready**: Optimized for deployment to Vercel, Netlify, or any Node.js server

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Speech Recognition**: Web Speech API (SpeechRecognition)
- **Speech Synthesis**: Web Speech API (SpeechSynthesis)

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A modern browser (Chrome, Edge, or Safari) that supports Web Speech API
- (Optional) ngrok for creating public tunnels

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Try the Demo

- Click "Try Live Demo" on the landing page
- Tap the microphone button and say something like:
  - "Pay gas bill 120 thousand so'm"
  - "Pay electricity same as last time"
  - "To'lash elektr uchun 85 ming"

## 🌐 Expose Demo with ngrok

To share your demo with others over the internet:

### Install ngrok

```bash
# macOS (using Homebrew)
brew install ngrok

# Or download from https://ngrok.com/download
```

### Run with Tunnel

```bash
npm run dev:tunnel
```

This will:
1. Start the Next.js dev server on port 3000
2. Create an ngrok tunnel
3. Display a public URL you can share (e.g., `https://abc123.ngrok.io`)

**Note**: The free ngrok tier gives you a random URL. You can use that URL to demo your app to anyone on the internet!

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

That's it! Vercel will automatically detect Next.js and configure everything.

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js:

- **Netlify**: Connect your repo and deploy
- **Railway**: One-click deploy
- **DigitalOcean App Platform**: Deploy from GitHub
- **Any VPS**: Run `npm run build && npm start`

## 🎯 Voice Commands Examples

### English
- "Pay gas bill 120 thousand so'm"
- "Pay electricity bill 85000"
- "Pay mobile phone 50 thousand"
- "Pay internet same as last time"

### Uzbek
- "Gaz uchun 120 ming to'lash"
- "Elektr uchun oldingi sum"
- "Ucell uchun 50 ming"

### Russian
- "Оплатить газ 120 тысяч сум"
- "Платить электричество как прошлый раз"
- "Оплатить интернет 100000"

## 🏗️ Project Structure

```
apex_fin_demo/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles
│   └── ovozpay/
│       └── page.tsx         # Main demo page
├── components/
│   ├── MicButton.tsx        # Microphone button with animations
│   ├── ChatWindow.tsx       # Chat interface
│   ├── MessageBubble.tsx    # Individual message bubble
│   ├── PaymentPanel.tsx     # Payment details panel
│   ├── PaymentTimeline.tsx  # Payment progress steps
│   ├── ReceiptCard.tsx      # Payment receipt
│   └── HistoryList.tsx      # Payment history
├── hooks/
│   ├── useSpeechRecognition.ts  # Speech recognition hook
│   └── useSpeechSynthesis.ts    # Text-to-speech hook
├── lib/
│   ├── types.ts             # TypeScript types
│   ├── intentParser.ts      # Intent parsing logic
│   └── mockPayments.ts      # Mock payment data
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## 🎨 Supported Providers

The demo supports the following bill providers:

- 🔥 **UzGas** - Gas bills
- ⚡ **UzElectric** - Electricity bills
- 📱 **Ucell** - Mobile phone bills
- 📱 **Beeline** - Mobile phone bills
- 🌐 **UzTelecom** - Internet bills
- 🌐 **Perfectum** - Internet bills
- 💧 **UzWater** - Water bills

## 🔧 Configuration

All configuration is in the standard Next.js files:

- `tailwind.config.ts` - Customize colors, animations
- `next.config.mjs` - Next.js configuration
- `lib/mockPayments.ts` - Add/modify providers and last payment amounts

## 🌐 Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Speech Recognition | ✅ | ✅ | ✅ | ❌* |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |

*Firefox doesn't support Web Speech API for speech recognition by default.

## 🐛 Troubleshooting

### Speech recognition not working?

1. Make sure you're using Chrome, Edge, or Safari
2. Check that you've granted microphone permissions
3. Ensure you're accessing via HTTPS (or localhost)

### No sound from assistant?

1. Check your system volume
2. Ensure speech synthesis is supported in your browser
3. Try a different browser voice in the browser settings

### ngrok not working?

1. Make sure ngrok is installed: `ngrok version`
2. You may need to sign up for a free account: `ngrok authtoken YOUR_TOKEN`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run dev:tunnel` - Start dev server + ngrok tunnel
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a demo project, but feel free to fork and customize it for your needs!

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Built with Next.js and React
- Icons by Lucide
- Animations by Framer Motion
- Speech APIs by browser vendors

---

**Made with ❤️ for accessible voice-powered payments**

For questions or issues, please open an issue on GitHub.
