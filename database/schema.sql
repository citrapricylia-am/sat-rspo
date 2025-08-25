-- SAT RSPO PADI Database Schema for Supabase PostgreSQL
-- This file contains the complete database schema for the project

-- Enable Row Level Security (RLS) - required for Supabase
-- This will be enabled on tables as needed

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('petani', 'manajer');
CREATE TYPE assessment_stage AS ENUM ('pretest', 'stage1', 'stage2', 'stage3', 'final');

-- User Profiles Table
-- Extends Supabase Auth users with additional profile information
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments Table
-- Stores assessment results and answers
CREATE TABLE assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stage assessment_stage NOT NULL,
    answers_json JSONB NOT NULL DEFAULT '{}',
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Login History Table
-- Tracks user login attempts and sessions
CREATE TABLE login_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    login_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_stage ON assessments(stage);
CREATE INDEX idx_assessments_user_stage ON assessments(user_id, stage);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_timestamp ON login_history(login_timestamp DESC);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS Policies
-- Users can read and update their own profile
CREATE POLICY \"Users can view own profile\" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY \"Users can update own profile\" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert own profile\" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessments RLS Policies  
-- Users can manage their own assessments
CREATE POLICY \"Users can view own assessments\" ON assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert own assessments\" ON assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can update own assessments\" ON assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY \"Users can delete own assessments\" ON assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Login History RLS Policies
-- Users can view their own login history
CREATE POLICY \"Users can view own login history\" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY \"Service can insert login history\" ON login_history
    FOR INSERT WITH CHECK (true); -- Allow service role to insert

-- Admin policies (for users with manajer role)
-- Manajer can view all data
CREATE POLICY \"Admins can view all profiles\" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'manajer'
        )
    );

CREATE POLICY \"Admins can view all assessments\" ON assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'manajer'
        )
    );

CREATE POLICY \"Admins can view all login history\" ON login_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'manajer'
        )
    );

-- Functions for common operations
-- Function to get user assessment statistics
CREATE OR REPLACE FUNCTION get_user_assessment_stats(target_user_id UUID)
RETURNS TABLE (
    total_assessments BIGINT,
    completed_assessments BIGINT,
    average_percentage NUMERIC,
    stages_completed TEXT[],
    latest_assessment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_assessments,
        COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END)::BIGINT as completed_assessments,
        COALESCE(AVG(CASE WHEN completed_at IS NOT NULL THEN percentage END), 0) as average_percentage,
        ARRAY_AGG(DISTINCT stage::TEXT) as stages_completed,
        MAX(created_at) as latest_assessment_date
    FROM assessments 
    WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean old login history (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_login_history()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM login_history 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data constraints and validations
-- Add check constraints
ALTER TABLE user_profiles 
    ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

ALTER TABLE user_profiles 
    ADD CONSTRAINT check_full_name_length 
    CHECK (LENGTH(TRIM(full_name)) >= 2);

ALTER TABLE user_profiles 
    ADD CONSTRAINT check_phone_length 
    CHECK (LENGTH(TRIM(phone)) >= 8);

ALTER TABLE assessments 
    ADD CONSTRAINT check_scores 
    CHECK (total_score >= 0 AND max_score > 0 AND total_score <= max_score);

ALTER TABLE assessments 
    ADD CONSTRAINT check_percentage 
    CHECK (percentage >= 0 AND percentage <= 100);

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profile information linked to Supabase Auth users';
COMMENT ON TABLE assessments IS 'Assessment results and answers for each user and stage';
COMMENT ON TABLE login_history IS 'Audit trail of user login attempts and sessions';

COMMENT ON COLUMN user_profiles.user_id IS 'Foreign key to auth.users.id from Supabase Auth';
COMMENT ON COLUMN assessments.answers_json IS 'JSON object containing all answers for the assessment';
COMMENT ON COLUMN assessments.percentage IS 'Calculated percentage score (total_score/max_score * 100)';
COMMENT ON COLUMN login_history.success IS 'Whether the login attempt was successful';

-- Grant necessary permissions
-- Note: These will be automatically handled by Supabase RLS policies
-- but documenting the intended access patterns

/*
Access Patterns:
1. Authenticated users can CRUD their own profile
2. Authenticated users can CRUD their own assessments  
3. Authenticated users can view their own login history
4. Admin users can view all data (read-only for auditing)
5. Service role can insert login history records
*/