# 🔧 SAFE Database Schema Deployment

## Problem: Existing Objects Conflict
You have existing database objects that conflict with the new schema. Here's how to fix it safely.

## Option 1: Clean Reset (RECOMMENDED)

**⚠️ WARNING: This will delete all existing data!**

```sql
-- Clean reset - removes all existing objects and data
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS assessment_indicators CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS assessment_stage CASCADE;

-- Now create the new schema
CREATE TYPE user_role AS ENUM ('petani', 'manajer');

-- User Profiles Table (matches your Supabase functions)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments Table (matches your data functions)
CREATE TABLE assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    assessment_type VARCHAR(100) NOT NULL DEFAULT 'sustainability',
    score DECIMAL(10,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Indicators Table
CREATE TABLE assessment_indicators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    indicator_name VARCHAR(255) NOT NULL,
    value TEXT,
    score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login History Table
CREATE TABLE login_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessment_indicators_assessment_id ON assessment_indicators(assessment_id);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_indicators_updated_at 
    BEFORE UPDATE ON assessment_indicators 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (simplified)
-- Users can manage their own profile
CREATE POLICY "users_own_profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Users can manage their own assessments
CREATE POLICY "users_own_assessments" ON assessments
    FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own indicators
CREATE POLICY "users_own_indicators" ON assessment_indicators
    FOR ALL USING (auth.uid() = user_id);

-- Users can view their own login history, service can insert
CREATE POLICY "users_own_login_history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "service_insert_login_history" ON login_history
    FOR INSERT WITH CHECK (true);

-- Admin users (manajer) can view all data
CREATE POLICY "admin_view_all_profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

CREATE POLICY "admin_view_all_assessments" ON assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- Add basic constraints
ALTER TABLE profiles 
    ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

ALTER TABLE profiles 
    ADD CONSTRAINT check_full_name_length 
    CHECK (LENGTH(TRIM(full_name)) >= 2);

-- Success message
SELECT 'Database schema created successfully!' as message;
```

## Option 2: Work with Existing Structure (SAFER)

If you want to keep existing data, run this instead:

```sql
-- Option 2: Rename existing table and update structure
-- This preserves existing data if any

-- First, let's see what we have
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- If user_profiles exists, we need to work with it or rename it
-- Let's rename user_profiles to profiles if it exists

DO $$
BEGIN
    -- Check if user_profiles exists and profiles doesn't
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public')
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        
        -- Drop existing policies first
        DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
        DROP POLICY IF EXISTS "Admins can view all assessments" ON assessments;
        DROP POLICY IF EXISTS "Admins can view all login history" ON login_history;
        
        -- Rename the table
        ALTER TABLE user_profiles RENAME TO profiles;
        
        -- Update the column if needed (user_id -> id)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
            ALTER TABLE profiles RENAME COLUMN user_id TO id;
        END IF;
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
            ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
        END IF;
        
    END IF;
END
$$;

-- Create new RLS policies with correct names
CREATE POLICY "users_own_profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "admin_view_all_profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- Update policies for other tables too
DROP POLICY IF EXISTS "Admins can view all assessments" ON assessments;
CREATE POLICY "admin_view_all_assessments" ON assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- Success message
SELECT 'Database schema updated successfully!' as message;
```

## Option 3: Quick Test Fix (TEMPORARY)

If you just want to test quickly, disable RLS temporarily:

```sql
-- TEMPORARY: Disable RLS for testing
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE login_history DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'RLS disabled for testing!' as message;
```

## Recommendation

1. **Use Option 1** if you're okay with starting fresh (no important data to lose)
2. **Use Option 2** if you have existing data you want to preserve
3. **Use Option 3** only for quick testing, then implement a proper solution

After running any option, test with:
```bash
node test-connection.js
```

## Next Steps After Schema Fix

1. ✅ Database schema deployed
2. ✅ Test connection: `node test-connection.js`
3. ✅ Test registration in your app
4. ✅ Verify no more 404/401 errors

Choose the option that best fits your situation!