#!/bin/bash
# Quick deployment script for Socket.IO server to Railway

echo "🚀 Chess App - Quick Socket.IO Server Deployment"
echo "=================================================="
echo ""
echo "This script will help you deploy the Socket.IO server to Railway"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI not found. Installing..."
    pnpm add -g @railway/cli
fi

echo "🔐 Logging into Railway..."
railway login

echo "🎮 Initializing Railway project..."
railway init

echo "🌐 Setting environment variables..."
echo "Please enter your Vercel URL (e.g., https://chess-n4aupr3cg-alvaro-lazaros-projects-e89161ce.vercel.app):"
read VERCEL_URL

railway variables set CORS_ORIGIN=$VERCEL_URL

echo "📤 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your Railway URL from the dashboard"
echo "2. Run: vercel env add NEXT_PUBLIC_SOCKET_URL production"
echo "3. Enter your Railway URL"
echo "4. Run: vercel --prod"
echo ""
echo "🎉 Your chess app will be fully functional!"
