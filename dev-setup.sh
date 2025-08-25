#!/bin/bash

# Development Setup Script for SAT RSPO PADI
echo "🚀 Starting SAT RSPO PADI Development Environment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

# Setup environment variables
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please ensure Supabase credentials are configured."
    exit 1
fi

echo "🌟 Environment configured with Supabase:"
echo "   URL: https://ileiutoopvambzimbjyr.supabase.co"
echo "   Project: ileiutoopvambzimbjyr"

# Start Vercel development server (handles both frontend and API)
echo "🔧 Starting development server with Vercel..."
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:3000/api/*"
echo ""
echo "Press Ctrl+C to stop the server"

vercel dev --listen 3000