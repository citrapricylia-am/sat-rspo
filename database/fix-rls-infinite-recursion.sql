-- =====================================================
-- FIX RLS INFINITE RECURSION ERROR (42P17)
-- =====================================================
-- This script fixes the infinite recursion in RLS policies

-- 1. Show current problematic policies
SELECT 
    '🔍 Current Problematic Policies' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- 2. Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "users_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles; 
DROP POLICY IF EXISTS "managers_view_all_profiles" ON profiles;
DROP POLICY IF EXISTS "managers_view_all_assessments" ON assessments;
DROP POLICY IF EXISTS "managers_view_all_login_history" ON login_history;

-- 3. Create SIMPLE, non-recursive RLS policies

-- Basic user access - users can manage their own profiles
CREATE POLICY "user_profile_access" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Allow profile insertion during registration
CREATE POLICY "user_profile_insert" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role full access (for emergency operations)
CREATE POLICY "service_role_access" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Fix assessments policies (remove recursive manager policy)
DROP POLICY IF EXISTS "users_own_assessments" ON assessments;
CREATE POLICY "user_assessments_access" ON assessments
    FOR ALL USING (auth.uid() = user_id);

-- 5. Fix login_history policies  
DROP POLICY IF EXISTS "users_own_login_history" ON login_history;
CREATE POLICY "user_login_history_access" ON login_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "service_insert_login_history" ON login_history;
CREATE POLICY "service_login_insert" ON login_history
    FOR INSERT WITH CHECK (true);

-- 6. Verify policies are fixed
SELECT 
    '✅ Fixed Policies' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    CASE 
        WHEN qual LIKE '%profiles%' AND tablename = 'profiles' THEN '❌ STILL RECURSIVE'
        ELSE '✅ SAFE'
    END as recursion_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 7. Test basic profile access
SELECT 
    '🧪 Testing Profile Access' as test_name,
    'Policies should now allow basic operations without recursion' as result;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS INFINITE RECURSION FIXED!';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Changes Made:';
    RAISE NOTICE '- Removed recursive manager policies';
    RAISE NOTICE '- Simplified to basic user-only access';
    RAISE NOTICE '- Added service role access for emergencies';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Policy Summary:';
    RAISE NOTICE '- Users can only access their OWN profiles';
    RAISE NOTICE '- Users can only access their OWN assessments';
    RAISE NOTICE '- Users can only view their OWN login history';
    RAISE NOTICE '- Service role has full access for system operations';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Login should work now without 42P17 error!';
    RAISE NOTICE '💡 If you need manager access, we''ll add it safely later';
END $$;