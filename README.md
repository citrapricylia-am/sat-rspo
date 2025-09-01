# SAT RSPO PADI Project

## 🚀 Clean Minimal Implementation

This project features a **clean, minimal React + Supabase implementation** with direct authentication integration using AuthContext.

### 🎆 Key Features
- **Direct Supabase Integration**: No API layer needed
- **React Context Authentication**: Centralized auth state management
- **Multi-strategy Profile Creation**: Robust error handling and recovery
- **Responsive UI**: Built with shadcn/ui and Tailwind CSS
- **TypeScript**: Full type safety throughout the application

### 🏗️ Project Structure

```
├── database/
│   ├── sat-rspo-schema.sql    # Complete database schema with RLS
│   └── fix-404-profiles.sql    # Fix script for orphaned users
├── src/
│   ├── components/             # React UI components
│   ├── contexts/              # AuthContext for state management
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # API utilities and Supabase client
│   ├── pages/                 # React pages (Login, Register, etc.)
│   └── data/                  # Assessment questions and data
└── public/                     # Static assets
```

## 📱 Usage

### Authentication Flow
- **Registration**: Direct Supabase Auth with automatic profile creation
- **Login**: Email/password authentication with profile synchronization
- **Emergency Profile Creation**: Automatic recovery for orphaned auth users

### Database Management
1. **Deploy Schema**: Run `database/sat-rspo-schema.sql` in Supabase SQL Editor
2. **Fix Orphaned Users**: Run `database/fix-404-profiles.sql` if needed

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Only "petani" and "manajer" roles supported
- ✅ User can only access their own data
- ✅ Supabase Auth integration
- ✅ TypeScript type safety

## 🛠️ Technologies

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + shadcn/ui
- React Router DOM

**Backend:**
- Supabase (PostgreSQL + Auth + RLS)
- Direct client integration (No API layer)
- TypeScript throughout

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
