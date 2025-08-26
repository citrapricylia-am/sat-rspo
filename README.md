# SAT RSPO PADI Project

## 🚀 Clean Minimal Implementation

This project features a **clean, minimal Supabase TypeScript backend** with authentication APIs ready for Vercel deployment.

### 🏗️ Project Structure

```
├── api/
│   └── auth/
│       ├── register.ts    # POST /api/auth/register
│       └── login.ts       # POST /api/auth/login
├── lib/
│   └── supabase-config.ts # Supabase client configuration
├── database/
│   └── sat-rspo-schema.sql # Database schema with RLS
└── src/                   # React/Vite frontend (preserved)
```

## 📋 API Endpoints

### Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "petani",        // or "manajer"
  "phone": "081234567890",  // optional
  "address": "Jl. Example"  // optional
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "..." },
    "session": { "access_token": "...", "refresh_token": "..." },
    "profile": { "full_name": "...", "role": "..." }
  }
}
```

## 🔧 Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Ensure `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ileiutoopvambzimbjyr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://ileiutoopvambzimbjyr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Deploy Database Schema
1. Copy `database/sat-rspo-schema.sql`
2. Paste in Supabase SQL Editor
3. Run the script

### 4. Test Connection
```bash
node test-clean-api.js
```

### 5. Development
```bash
npm run dev     # Start Vite frontend
npm run build   # Build for production
```

## 🚀 Vercel Deployment

### Automatic Deploy
```bash
npx vercel
```

### Environment Variables in Vercel
Add these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Only "petani" and "manajer" roles supported
- ✅ User can only access their own data
- ✅ Supabase Auth integration
- ✅ TypeScript type safety

## 🛠️ Technologies

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui

**Backend:**
- Next.js API Routes (TypeScript)
- Supabase (PostgreSQL + Auth)
- Vercel Serverless Functions

## 📖 Database Schema

**Tables:**
- `profiles` - User profile information
- `assessments` - Assessment data (optional)
- `login_history` - Login audit trail (optional)

**Key Features:**
- UUID primary keys
- Foreign key constraints
- Automatic timestamps
- RLS policies
- Role-based access control
