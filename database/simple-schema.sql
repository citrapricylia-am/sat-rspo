-- Simple Database Schema for SAT RSPO PADI
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('petani', 'manajer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create assessment stage enum  
DO $$ BEGIN
    CREATE TYPE assessment_stage AS ENUM ('stage_1', 'stage_2', 'stage_3');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    role user_role NOT NULL DEFAULT 'petani',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stage assessment_stage NOT NULL,
    answers_json JSONB,
    total_score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create login_history table
CREATE TABLE IF NOT EXISTS login_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for assessments
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
CREATE POLICY "Users can view own assessments" ON assessments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON assessments;
CREATE POLICY "Users can insert own assessments" ON assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
CREATE POLICY "Users can update own assessments" ON assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for login_history
DROP POLICY IF EXISTS "Users can view own login history" ON login_history;
CREATE POLICY "Users can view own login history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert login history" ON login_history;
CREATE POLICY "Service can insert login history" ON login_history
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_stage ON assessments(stage);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);

-- Success message
SELECT 'Database schema created successfully!' as message;