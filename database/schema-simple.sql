-- Simple SAT RSPO PADI Database Schema for Supabase PostgreSQL
-- This is a simplified version for initial testing

-- Create custom types/enums
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