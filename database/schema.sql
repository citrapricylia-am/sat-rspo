-- SAT RSPO PADI Database Schema for Supabase PostgreSQL
-- This file contains the complete database schema for the project

-- Enable Row Level Security (RLS) - required for Supabase
-- This will be enabled on tables as needed

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('petani', 'manajer');

-- User Profiles Table
-- Extends Supabase Auth users with additional profile information
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments Table
-- Stores assessment results and data
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
-- Stores individual indicators for each assessment
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
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_assessment_indicators_assessment_id ON assessment_indicators(assessment_id);
CREATE INDEX idx_assessment_indicators_user_id ON assessment_indicators(user_id);
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

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS Policies
-- Users can read and update their own profile
CREATE POLICY "users_can_view_own_profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Assessments RLS Policies  
-- Users can manage their own assessments
CREATE POLICY "users_can_view_own_assessments" ON assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_assessments" ON assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_assessments" ON assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_assessments" ON assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Assessment Indicators RLS Policies
-- Users can manage their own assessment indicators
CREATE POLICY "users_can_view_own_indicators" ON assessment_indicators
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_indicators" ON assessment_indicators
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_indicators" ON assessment_indicators
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_indicators" ON assessment_indicators
    FOR DELETE USING (auth.uid() = user_id);

-- Login History RLS Policies
-- Users can view their own login history
CREATE POLICY "users_can_view_own_login_history" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "service_can_insert_login_history" ON login_history
    FOR INSERT WITH CHECK (true); -- Allow service role to insert

-- Admin policies (for users with manajer role)
-- Manajer can view all data
CREATE POLICY "admins_can_view_all_profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

CREATE POLICY "admins_can_view_all_assessments" ON assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

CREATE POLICY "admins_can_view_all_indicators" ON assessment_indicators
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

CREATE POLICY "admins_can_view_all_login_history" ON login_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'manajer'
        )
    );

-- Functions for common operations
-- Function to get user assessment statistics
CREATE OR REPLACE FUNCTION get_user_assessment_stats(target_user_id UUID)
RETURNS TABLE (
    total_assessments BIGINT,
    completed_assessments BIGINT,
    average_score NUMERIC,
    assessment_types TEXT[],
    latest_assessment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_assessments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::BIGINT as completed_assessments,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN score END), 0) as average_score,
        ARRAY_AGG(DISTINCT assessment_type) as assessment_types,
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
ALTER TABLE profiles 
    ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

ALTER TABLE profiles 
    ADD CONSTRAINT check_full_name_length 
    CHECK (LENGTH(TRIM(full_name)) >= 2);

ALTER TABLE assessments 
    ADD CONSTRAINT check_status_values 
    CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled'));

ALTER TABLE assessments 
    ADD CONSTRAINT check_assessment_type_values 
    CHECK (assessment_type IN ('sustainability', 'environmental', 'social', 'governance'));

ALTER TABLE assessment_indicators 
    ADD CONSTRAINT check_indicator_score 
    CHECK (score >= 0 AND score <= 10);

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profile information linked to Supabase Auth users';
COMMENT ON TABLE assessments IS 'Assessment data and metadata for each user';
COMMENT ON TABLE assessment_indicators IS 'Individual indicators and scores for assessments';
COMMENT ON TABLE login_history IS 'Audit trail of user login attempts and sessions';

COMMENT ON COLUMN profiles.id IS 'Primary key that matches auth.users.id from Supabase Auth';
COMMENT ON COLUMN assessments.metadata IS 'JSON object containing additional assessment data';
COMMENT ON COLUMN assessment_indicators.score IS 'Numeric score for this indicator (0-10 scale)';
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