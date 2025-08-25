# Supabase Project Setup Guide

## Your Project Configuration ✅
Your Supabase credentials have been implemented in the project:

- **Project URL**: `https://ileiutoopvambzimbjyr.supabase.co`
- **Project ID**: `ileiutoopvambzimbjyr`
- **Region**: Auto-detected from URL

## Next Steps to Complete Setup

### 1. Deploy Database Schema
Navigate to your Supabase project dashboard and run the SQL schema:

1. Go to: https://ileiutoopvambzimbjyr.supabase.co/project/ileiutoopvambzimbjyr
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the content from `database/schema.sql`
5. Click "Run" to execute the schema

### 2. Configure Row Level Security (RLS)
The schema includes RLS policies, but verify they are enabled:

1. Go to "Authentication" → "Policies"
2. Ensure RLS is enabled for all tables:
   - `user_profiles`
   - `assessments`
   - `login_history`

### 3. Test API Endpoints
After schema deployment, test your backend:

```bash
# Test registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "1234567890",
    "address": "Test Address",
    "role": "petani"
  }'

# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Deploy to Vercel
Your project is ready for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# SUPABASE_URL=https://ileiutoopvambzimbjyr.supabase.co
# SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# SUPABASE_SERVICE_ROLE_KEY=sb_secret_v-exLyRqv6emxorKu9YO2A_HaTSzDlR
```

## File Structure
```
c:\xampp\htdocs\sat-rspo-padi\
├── api/                    # Backend API endpoints
│   ├── lib/               # Shared utilities
│   ├── types/             # TypeScript definitions
│   ├── login.ts           # Authentication endpoint
│   ├── register.ts        # User registration
│   ├── profile.ts         # User profile management
│   └── save-assessment.ts # Assessment CRUD
├── database/
│   └── schema.sql         # PostgreSQL schema with RLS
├── src/
│   └── lib/
│       └── supabase-client.tsx # React hooks
├── .env.local             # Supabase credentials ✅
└── vercel.json           # Deployment configuration
```

## Available User Roles
The system is configured for exactly 2 roles:
- `petani` (Farmer)
- `manajer` (Manager)

## API Endpoints Ready
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/save-assessment` - Create assessment
- `GET /api/save-assessment` - List assessments
- `PUT /api/save-assessment` - Update assessment
- `DELETE /api/save-assessment` - Delete assessment

Your backend is now configured and ready to use! 🚀