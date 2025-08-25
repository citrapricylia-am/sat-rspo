@echo off
echo 🚀 Starting SAT RSPO PADI Development Environment...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Install project dependencies
echo 📦 Installing project dependencies...
npm install

REM Check environment variables
if not exist ".env.local" (
    echo ⚠️  .env.local not found. Please ensure Supabase credentials are configured.
    pause
    exit /b 1
)

echo 🌟 Environment configured with Supabase:
echo    URL: https://ileiutoopvambzimbjyr.supabase.co
echo    Project: ileiutoopvambzimbjyr
echo.

REM Start Vercel development server (handles both frontend and API)
echo 🔧 Starting development server with Vercel...
echo    Frontend: http://localhost:3000
echo    API: http://localhost:3000/api/*
echo.
echo Press Ctrl+C to stop the server

vercel dev --listen 3000