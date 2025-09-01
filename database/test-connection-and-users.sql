-- =====================================================
-- TEST DATABASE CONNECTION AND CHECK USER STATUS
-- =====================================================
-- Run this first to see what's happening with your users

-- 1. Test basic connection
SELECT 'Database connection working' as status, NOW() as current_time;

-- 2. Check if profiles table exists
SELECT 
    'Profile Table Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') 
        THEN 'EXISTS' 
        ELSE 'MISSING - RUN SCHEMA FIRST' 
    END as result;

-- 3. Check trigger status (should be removed)
SELECT 
    'Trigger Status' as check_type,
    CASE 
        WHEN COUNT(*) = 0 THEN 'CORRECTLY REMOVED'
        ELSE 'STILL EXISTS - NEEDS REMOVAL'
    END as result
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Count auth users vs profiles
SELECT 
    'User Status Summary' as check_type,
    COUNT(u.*) as total_auth_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(u.*) - COUNT(p.id) as orphaned_users,
    CASE 
        WHEN COUNT(u.*) - COUNT(p.id) = 0 THEN 'ALL USERS HAVE PROFILES ✅'
        ELSE 'ORPHANED USERS EXIST - RUN FIX SCRIPT ❌'
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- 5. Show specific problem users from your logs
SELECT 
    'Problem Users Check' as check_type,
    u.id,
    u.email,
    u.created_at,
    CASE 
        WHEN p.id IS NOT NULL THEN 'HAS PROFILE ✅'
        ELSE 'MISSING PROFILE ❌'
    END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.id IN (
    '45f9e0d6-2207-4e05-b478-d2cd57c53c16',
    '0510e0cd-27bf-43bf-8e5e-6ca754b27b0c',
    '2eb71c47-7a65-4a4d-aab5-ed5a03458cfb'
) AND u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC;

-- 6. Show recent users (last 24 hours)
SELECT 
    'Recent Users (Last 24h)' as check_type,
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data,
    CASE 
        WHEN p.id IS NOT NULL THEN 'HAS PROFILE ✅'
        ELSE 'MISSING PROFILE ❌'
    END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '24 hours'
  AND u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC
LIMIT 10;

-- 7. Check RLS policies
SELECT 
    'RLS Policies Check' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- Final summary message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== DIAGNOSTIC COMPLETE ===';
    RAISE NOTICE '';
    RAISE NOTICE 'If you see orphaned users above:';
    RAISE NOTICE '1. Run: database/remove-trigger-final-fix.sql';
    RAISE NOTICE '2. Refresh your app';
    RAISE NOTICE '3. Try login again';
    RAISE NOTICE '';
    RAISE NOTICE 'If profiles table is missing:';
    RAISE NOTICE '1. Run: database/sat-rspo-schema.sql first';
    RAISE NOTICE '2. Then run: database/remove-trigger-final-fix.sql';
END $$;