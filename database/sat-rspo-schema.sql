-- =====================================================
-- SAT RSPO PADI Database Schema for Supabase PostgreSQL
-- =====================================================
-- 
-- This script creates the complete database schema for the SAT RSPO PADI project
-- Copy and paste this entire script into Supabase SQL Editor and run it
--
-- Tables created:
-- 1. profiles - User profile information
-- 2. assessments - Assessment data with stages and scores
-- 3. login_history - Login tracking and audit trail
--
-- Features:
-- ✅ Row Level Security (RLS) enabled
-- ✅ User can only access their own data
-- ✅ Automatic timestamps
-- ✅ Foreign key constraints
-- ✅ Proper indexing
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================

-- Create user role enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('petani', 'manajer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing table if exists (for clean deployment)
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL CHECK (LENGTH(TRIM(full_name)) >= 2),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    phone VARCHAR(20),
    address TEXT,
    role user_role NOT NULL DEFAULT 'petani',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- =====================================================
-- 2. ASSESSMENTS TABLE
-- =====================================================

-- Create assessment stage enum
DO $$ BEGIN
    CREATE TYPE assessment_stage AS ENUM ('pretest', 'stage1', 'stage2', 'stage3', 'final');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing table if exists
DROP TABLE IF EXISTS assessments CASCADE;

-- Create assessments table
CREATE TABLE assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stage assessment_stage NOT NULL,
    answers_json JSONB DEFAULT '{}' NOT NULL,
    total_score DECIMAL(10,2) DEFAULT 0 CHECK (total_score >= 0),
    max_score DECIMAL(10,2) DEFAULT 100 CHECK (max_score > 0),
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN max_score > 0 THEN ROUND((total_score / max_score * 100)::NUMERIC, 2)
            ELSE 0 
        END
    ) STORED,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Ensure only one assessment per user per stage
    UNIQUE(user_id, stage)
);

-- Create indexes for assessments
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_stage ON assessments(stage);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at DESC);
CREATE INDEX idx_assessments_user_stage ON assessments(user_id, stage);

-- =====================================================
-- 3. LOGIN HISTORY TABLE
-- =====================================================

-- Drop existing table if exists
DROP TABLE IF EXISTS login_history CASCADE;

-- Create login_history table
CREATE TABLE login_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for login_history
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_timestamp ON login_history(login_timestamp DESC);
CREATE INDEX idx_login_history_success ON login_history(success);
CREATE INDEX idx_login_history_user_success ON login_history(user_id, success);

-- =====================================================
-- 4. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES RLS POLICIES
-- =====================================================

-- Users can view and update their own profile
DROP POLICY IF EXISTS "users_own_profile" ON profiles;
CREATE POLICY "users_own_profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Allow users to insert their own profile (for registration)
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Managers can view all profiles (read-only)
DROP POLICY IF EXISTS "managers_view_all_profiles" ON profiles;
CREATE POLICY "managers_view_all_profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- =====================================================
-- ASSESSMENTS RLS POLICIES
-- =====================================================

-- Users can manage their own assessments
DROP POLICY IF EXISTS "users_own_assessments" ON assessments;
CREATE POLICY "users_own_assessments" ON assessments
    FOR ALL USING (auth.uid() = user_id);

-- Managers can view all assessments (read-only)
DROP POLICY IF EXISTS "managers_view_all_assessments" ON assessments;
CREATE POLICY "managers_view_all_assessments" ON assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- =====================================================
-- LOGIN HISTORY RLS POLICIES
-- =====================================================

-- Users can view their own login history
DROP POLICY IF EXISTS "users_own_login_history" ON login_history;
CREATE POLICY "users_own_login_history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

-- Service/system can insert login records (for all users)
DROP POLICY IF EXISTS "service_insert_login_history" ON login_history;
CREATE POLICY "service_insert_login_history" ON login_history
    FOR INSERT WITH CHECK (true);

-- Managers can view all login history (read-only)
DROP POLICY IF EXISTS "managers_view_all_login_history" ON login_history;
CREATE POLICY "managers_view_all_login_history" ON login_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- =====================================================
-- 6. USER METADATA TRIGGER FUNCTION
-- =====================================================

-- Function to automatically create user profile from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, address, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'address',
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'petani')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to get user assessment statistics
-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS get_user_assessment_stats(UUID);

CREATE OR REPLACE FUNCTION get_user_assessment_stats(target_user_id UUID)
RETURNS TABLE (
    total_assessments BIGINT,
    completed_assessments BIGINT,
    average_score NUMERIC,
    stages_completed TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_assessments,
        COUNT(completed_at)::BIGINT as completed_assessments,
        COALESCE(AVG(CASE WHEN completed_at IS NOT NULL THEN total_score END), 0) as average_score,
        ARRAY_AGG(DISTINCT stage::TEXT) FILTER (WHERE completed_at IS NOT NULL) as stages_completed
    FROM assessments 
    WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old login history (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_login_history(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM login_history 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. SAMPLE DATA CONSTRAINTS & VALIDATIONS
-- =====================================================

-- Additional constraints for data integrity
ALTER TABLE assessments 
    ADD CONSTRAINT check_percentage_range 
    CHECK (percentage >= 0 AND percentage <= 100);

ALTER TABLE assessments 
    ADD CONSTRAINT check_scores_positive 
    CHECK (total_score >= 0 AND max_score > 0);

-- =====================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE profiles IS 'User profile information linked to Supabase Auth';
COMMENT ON TABLE assessments IS 'Assessment data with stages, answers, and scores';
COMMENT ON TABLE login_history IS 'Audit trail for user login attempts and sessions';

COMMENT ON COLUMN profiles.id IS 'References auth.users.id from Supabase Auth';
COMMENT ON COLUMN assessments.answers_json IS 'JSON object containing assessment questions and answers';
COMMENT ON COLUMN assessments.percentage IS 'Auto-calculated percentage score based on total_score/max_score';
COMMENT ON COLUMN login_history.success IS 'Whether the login attempt was successful';

-- =====================================================
-- DEPLOYMENT COMPLETE
-- =====================================================

-- Verify tables were created successfully
DO $$
DECLARE
    profile_count INTEGER;
    assessment_count INTEGER;
    login_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM information_schema.tables WHERE table_name = 'profiles';
    SELECT COUNT(*) INTO assessment_count FROM information_schema.tables WHERE table_name = 'assessments';
    SELECT COUNT(*) INTO login_count FROM information_schema.tables WHERE table_name = 'login_history';
    
    IF profile_count = 1 AND assessment_count = 1 AND login_count = 1 THEN
        RAISE NOTICE '✅ All tables created successfully!';
        RAISE NOTICE '📋 Tables: profiles, assessments, login_history';
        RAISE NOTICE '🔒 Row Level Security: ENABLED';
        RAISE NOTICE '🏗️ Database schema deployment complete!';
    ELSE
        RAISE EXCEPTION '❌ Error: Not all tables were created properly';
    END IF;
END $$;