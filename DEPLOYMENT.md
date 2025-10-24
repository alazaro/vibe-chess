# Deployment Guide

## Vercel Deployment (Frontend)

This Next.js application is configured for Vercel deployment.

### Quick Deploy

1. **Automatic deployment** (already configured):
   ```bash
   vercel
   ```
   Follow the prompts to link your project and deploy.

2. **Production deployment**:
   ```bash
   vercel --prod
   ```

### Important Notes

#### Socket.IO Server
The multiplayer feature requires a separate WebSocket server (`server.ts`) that **cannot** run on Vercel's serverless platform. You have several options:

1. **Railway** (Recommended - Free tier available):
   - Push your code to GitHub
   - Connect Railway to your GitHub repo
   - Set start command: `pnpm run server`
   - Railway will provide a WebSocket-compatible URL

2. **Render** (Free tier available):
   - Similar to Railway
   - Deploy the `server.ts` as a Web Service

3. **Fly.io** (Free tier available):
   - Good for WebSocket applications
   - Deploy using their CLI

4. **Heroku** (Paid):
   - Traditional option for Node.js servers

#### Environment Variables

After deploying the Socket.IO server, set the environment variable in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add: `NEXT_PUBLIC_SOCKET_URL` = `https://your-socket-server-url.com`

Or use the Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_SOCKET_URL
```

### Features That Work Without Socket.IO Server

- Local 1v1 play (same device)
- Play against Stockfish AI
- Puzzle mode

The online multiplayer will only work once you've deployed the Socket.IO server separately.

## Alternative: Deploy Everything to Railway

If you want to deploy both frontend and backend together:

1. Create a `Procfile`:
   ```
   web: pnpm run dev:all
   ```

2. Deploy to Railway which supports both Next.js and WebSockets

## Deployment Checklist

- [x] Vercel configuration created (`vercel.json`)
- [x] Environment variable example created (`.env.example`)
- [x] Socket URL made configurable
- [ ] Deploy Socket.IO server to Railway/Render/Fly.io
- [ ] Set `NEXT_PUBLIC_SOCKET_URL` environment variable in Vercel
- [ ] Deploy to Vercel

## Commands

```bash
# Deploy to Vercel (preview)
vercel

# Deploy to Vercel (production)
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```
