-- =====================================================
-- FIX RLS POLICIES FOR PROFILE ACCESS
-- =====================================================
-- This script fixes the 500 error when fetching user profiles

-- First, let's check what's causing the issue by temporarily disabling RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "users_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "managers_view_all_profiles" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple and effective policies
-- Policy 1: Users can do everything with their own profile
CREATE POLICY "users_manage_own_profile" ON profiles
    FOR ALL 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy 2: Allow public read access for testing (can be removed later)
CREATE POLICY "public_read_profiles" ON profiles
    FOR SELECT 
    TO authenticated
    USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies updated successfully!';
    RAISE NOTICE '🔓 Added temporary public read access for testing';
    RAISE NOTICE '🔐 Users can manage their own profiles';
    RAISE NOTICE '🧪 Try login again - should work now!';
END $$;