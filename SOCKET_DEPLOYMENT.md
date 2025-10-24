# Railway Deployment for Socket.IO Server

This directory contains configuration for deploying the Socket.IO multiplayer server to Railway.

## Quick Deploy to Railway

1. **Install Railway CLI** (optional, can also use web interface):
   ```bash
   pnpm add -g @railway/cli
   railway login
   ```

2. **Deploy via Railway CLI**:
   ```bash
   railway init
   railway up
   ```

3. **Or use Railway Dashboard**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository
   - Set these configurations:
     - **Start Command**: `node server.js`
     - **Build Command**: `pnpm install && pnpm build:server`
   - Railway will automatically detect Node.js and deploy

4. **Get your server URL**:
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL

5. **Update Vercel Environment Variable**:
   ```bash
   vercel env add NEXT_PUBLIC_SOCKET_URL production
   # Paste your Railway URL when prompted
   ```

   Then redeploy:
   ```bash
   vercel --prod
   ```

## Alternative: Render.com

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server.js`
5. Deploy and get your URL

## Alternative: Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Launch
flyctl launch

# Deploy
flyctl deploy
```
