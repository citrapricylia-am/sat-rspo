# SAT RSPO PADI - Supabase Backend

Complete backend solution using Supabase Auth + PostgreSQL for the SAT RSPO PADI project.

## 🚀 Features

- ✅ Supabase Auth (login, register, logout)
- ✅ PostgreSQL database with Row Level Security (RLS)
- ✅ Complete CRUD APIs for users and assessments
- ✅ TypeScript support with full type definitions
- ✅ CORS enabled for frontend deployment
- ✅ Production-ready for Vercel deployment
- ✅ React hooks and examples included

## 📋 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login  
- `POST /api/logout` - User logout

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/user-stats` - Get user statistics

### Assessment Management
- `POST /api/save-assessment` - Create assessment
- `GET /api/save-assessment` - Get assessments
- `PUT /api/save-assessment?id={id}` - Update assessment
- `DELETE /api/save-assessment?id={id}` - Delete assessment

## 🔧 Setup Instructions

### 1. Supabase Project Setup ✅ **CONFIGURED**

**Project Details:**
- **URL**: https://ileiutoopvambzimbjyr.supabase.co
- **Project ID**: ileiutoopvambzimbjyr
- **Region**: Auto-selected by Supabase

**API Keys:**
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ✅
- **Service Role Key**: `sb_secret_v-exLyRqv6emxorKu9YO2A_HaTSzDlR` ✅

> ⚠️ **Security Note**: The service role key has been configured for backend operations. Keep it secure and never expose it in frontend code.

### 2. Setup Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy content from `database/schema.sql`
3. Run the SQL to create tables and policies

### 3. Environment Variables ✅ **CONFIGURED**

**Development** (`.env.local`):
```env
SUPABASE_URL=https://ileiutoopvambzimbjyr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q
SUPABASE_SERVICE_ROLE_KEY=sb_secret_v-exLyRqv6emxorKu9YO2A_HaTSzDlR
```

**Frontend** (React/Next.js):
```env
REACT_APP_SUPABASE_URL=https://ileiutoopvambzimbjyr.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZWl1dG9vcHZhbWJ6aW1ianlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDQxNzAsImV4cCI6MjA3MTY4MDE3MH0.MFWTrB6O54s0v9wsrpbUjpvkO0TlnsY8QY7SrDsj09Q
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Deploy to Vercel

1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy

## 📊 Database Schema

### Tables Created

1. **user_profiles** - Extended user information
2. **assessments** - Assessment results and answers
3. **login_history** - Audit trail of login attempts

### Key Features
- Row Level Security (RLS) policies
- Automatic timestamps
- JSON field for assessment answers
- Enum types for roles and stages

## 🔐 Security Features

- Row Level Security (RLS) policies
- JWT-based authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Admin role permissions

## 📝 Example Usage

### Frontend Integration

```typescript
import { AuthProvider, useAuth, useAssessment } from './lib/supabase-client'

// Wrap your app
<AuthProvider>
  <YourApp />
</AuthProvider>

// Use in components
const { signIn, user, profile } = useAuth()
const { createAssessment, assessments } = useAssessment()

// Login
await signIn('user@example.com', 'password')

// Create assessment
await createAssessment({
  stage: 'stage1',
  answers_json: { q1: { answer: 'Yes', score: 10 } },
  total_score: 10,
  max_score: 10,
  percentage: 100
})
```

### API Examples

```bash
# Register user
curl -X POST https://your-app.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "phone": "08123456789",
    "address": "Jakarta",
    "role": "petani"
  }'

# Login
curl -X POST https://your-app.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get profile (with auth token)
curl -X GET https://your-app.vercel.app/api/profile \
  -H "Authorization: Bearer your-jwt-token"

# Save assessment
curl -X POST https://your-app.vercel.app/api/save-assessment \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "pretest",
    "answers_json": {"q1": {"answer": "Yes", "score": 5}},
    "total_score": 5,
    "max_score": 10,
    "percentage": 50
  }'
```

## 📂 File Structure

```
api/
├── types/
│   └── database.ts        # TypeScript type definitions
├── lib/
│   ├── db.ts             # Supabase client and operations
│   └── middleware.ts     # Auth middleware and validation
├── login.ts              # Login endpoint
├── register.ts           # Register endpoint
├── logout.ts             # Logout endpoint
├── profile.ts            # Profile CRUD
├── save-assessment.ts    # Assessment CRUD
└── user-stats.ts         # User statistics

src/
├── lib/
│   └── supabase-client.tsx  # React hooks and client
└── examples/
    └── SupabaseExamples.tsx # Complete React examples

database/
└── schema.sql            # PostgreSQL schema
```

## 🚀 Deployment Steps

### Supabase Setup
1. Create project at supabase.com
2. Run schema.sql in SQL Editor
3. Configure RLS policies (included in schema)
4. Get API keys from Project Settings

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically
4. Test endpoints

### Frontend Integration
1. Install `@supabase/supabase-js`
2. Copy `supabase-client.tsx` to your project
3. Wrap app with `AuthProvider`
4. Use `useAuth` and `useAssessment` hooks

## 🐛 Troubleshooting

### RLS Policy Issues
- Check if user is authenticated
- Verify user_id matches in policies
- Test with service role key for debugging

### CORS Errors
- Update allowed origins in middleware
- Check Vercel environment variables
- Verify API URL in frontend

### Authentication Problems
- Check Supabase project settings
- Verify environment variables
- Test with Supabase dashboard Auth section

## 🎯 Production Checklist

- [ ] Supabase project configured
- [ ] Database schema deployed
- [ ] RLS policies active
- [ ] Environment variables set in Vercel
- [ ] CORS configured for production domain
- [ ] Frontend updated with production API URLs
- [ ] Email confirmation enabled (optional)
- [ ] Rate limiting configured

## 📞 Support

For issues or questions:
1. Check Supabase documentation
2. Review schema.sql for RLS policies
3. Test endpoints with provided examples
4. Check Vercel deployment logs

The backend is now fully functional and production-ready with Supabase!