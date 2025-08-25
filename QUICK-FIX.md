# 🚨 Quick Fix for 404 API Error

## Problem
The frontend is getting a 404 error when trying to access `/api/register` because the API endpoints are not being served locally.

## Solution
You need to run the development server using Vercel CLI to serve both frontend and API endpoints.

## Step-by-Step Fix

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Setup Database Schema (First Time Only)
1. Go to your Supabase dashboard: https://ileiutoopvambzimbjyr.supabase.co
2. Navigate to "SQL Editor" 
3. Create a new query
4. Copy the content from `database/schema.sql`
5. Click "Run" to create the tables and policies

### 3. Start Development Server
Instead of `npm run dev`, use:

**Option A: Use npm script (recommended)**
```bash
npm run dev
```

**Option B: Use Vercel directly**
```bash
vercel dev --listen 3000
```

**Option C: Use batch file (Windows)**
```bash
dev-setup.bat
```

### 4. Access Your Application
- Frontend: http://localhost:3000
- API Endpoints: http://localhost:3000/api/*
- Test Registration: http://localhost:3000/api/register

## What This Fixes
- ✅ API endpoints will be available at `/api/*`
- ✅ Frontend can successfully call backend APIs
- ✅ CORS is properly configured
- ✅ Environment variables are loaded correctly
- ✅ Supabase authentication will work

## Important Notes
1. **Stop your current Vite server** (Ctrl+C) before running the new command
2. **Make sure .env.local exists** with your Supabase credentials
3. **Database schema must be deployed** to Supabase before testing

## Test the Fix
After starting the server, try registering a new user:
1. Go to http://localhost:3000
2. Click "Register" 
3. Fill in the form
4. The 404 error should be gone!

## Alternative Frontend-Only Development
If you only want to work on the frontend UI:
```bash
npm run dev:frontend
```
This runs only Vite, but API calls will still fail (expected behavior).