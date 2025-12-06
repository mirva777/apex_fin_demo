# 🚀 Deployment Guide - OvozPay AI

This guide covers multiple deployment options for your voice payment assistant.

---

## ☁️ Vercel (Recommended)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic builds from Git
- ✅ Global CDN
- ✅ Zero configuration for Next.js

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ovozpay-ai.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"
   
3. **Done!** 🎉
   - Your app will be live at `https://your-project.vercel.app`
   - Every push to `main` branch auto-deploys

### Custom Domain (Optional)
- In Vercel dashboard, go to Settings → Domains
- Add your custom domain
- Update DNS records as shown

---

## 🦅 Netlify

**Steps:**

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Configure Next.js** (Important!)
   - Install Netlify plugin:
     ```bash
     npm install -D @netlify/plugin-nextjs
     ```
   - Create `netlify.toml`:
     ```toml
     [build]
       command = "npm run build"
       publish = ".next"
     
     [[plugins]]
       package = "@netlify/plugin-nextjs"
     ```

---

## 🚂 Railway

**Steps:**

1. **Push to GitHub**

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Next.js

3. **Configure**
   - No configuration needed!
   - Railway will automatically:
     - Install dependencies
     - Build the app
     - Start the server

4. **Get URL**
   - Click "Settings" → "Generate Domain"
   - Your app is live!

---

## 🌊 DigitalOcean App Platform

**Steps:**

1. **Push to GitHub**

2. **Create App**
   - Go to [DigitalOcean](https://digitalocean.com)
   - Apps → Create App
   - Connect GitHub repository

3. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - HTTP Port: 3000

4. **Deploy**
   - Click "Create Resources"
   - Wait for build to complete

---

## 🐳 Docker (Self-Hosted)

**Create Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Update next.config.mjs:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
};

export default nextConfig;
```

**Build and Run:**

```bash
# Build image
docker build -t ovozpay-ai .

# Run container
docker run -p 3000:3000 ovozpay-ai
```

---

## 🖥️ VPS (Ubuntu/Debian)

**Requirements:**
- Node.js 18+
- nginx (for reverse proxy)
- PM2 (for process management)

### Steps:

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Build**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ovozpay-ai.git
   cd ovozpay-ai
   npm install
   npm run build
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Start App**
   ```bash
   pm2 start npm --name "ovozpay" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable HTTPS** (Optional but recommended)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔐 Environment Variables

This project doesn't require any environment variables by default. If you add any in the future:

1. **Local Development**
   - Create `.env.local`
   - Add your variables

2. **Vercel/Netlify/Railway**
   - Add in dashboard under "Environment Variables"

3. **Docker**
   - Pass with `-e` flag or use `.env` file

---

## 📊 Performance Optimization

### For Production Deployment:

1. **Enable Compression** (already enabled in Next.js)

2. **Use CDN** (automatic with Vercel/Netlify)

3. **Optimize Images**
   - Next.js automatically optimizes images
   - Use `next/image` component

4. **Enable Caching**
   - Already configured in Next.js
   - No additional setup needed

---

## 🔍 Monitoring

### Recommended Tools:

- **Vercel Analytics** (if using Vercel)
- **Google Analytics** (add to `app/layout.tsx`)
- **Sentry** (for error tracking)
- **LogRocket** (for session replay)

---

## 🌍 Custom Domain Setup

### Vercel:
1. Dashboard → Settings → Domains
2. Add domain
3. Update DNS records

### Netlify:
1. Site settings → Domain management
2. Add custom domain
3. Update DNS

### Cloudflare (Optional):
- Add as DNS provider
- Enable CDN and caching
- Enable automatic HTTPS

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test # if you have tests
```

---

## ✅ Pre-Deployment Checklist

- [ ] All dependencies installed
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] Tested on Chrome, Safari, and Edge
- [ ] Microphone permissions work
- [ ] Speech recognition tested
- [ ] Mobile responsive checked
- [ ] README updated
- [ ] Git repository created
- [ ] Environment variables configured (if any)

---

## 🆘 Common Issues

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Speech API Not Working
- Ensure HTTPS is enabled (required for speech API)
- Check browser compatibility
- Verify microphone permissions

---

## 📞 Need Help?

- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Open an issue on GitHub
- Check platform-specific documentation

---

**Happy Deploying! 🚀**
