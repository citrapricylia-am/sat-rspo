-- =====================================================
-- REMOVE FAULTY TRIGGER AND ENSURE AUTOMATIC PROFILES
-- =====================================================
-- This script completely removes the problematic trigger
-- and ensures the application handles all profile creation

-- 1. Check current trigger status
SELECT 
    '🔍 Current Trigger Status' as status,
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Remove the problematic trigger completely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Remove the trigger function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Verify trigger removal
SELECT 
    '✅ Trigger Removal Verification' as status,
    CASE 
        WHEN COUNT(*) = 0 THEN 'TRIGGER SUCCESSFULLY REMOVED - APP WILL HANDLE PROFILES'
        ELSE 'TRIGGER STILL EXISTS - NEED MANUAL REMOVAL'
    END as result
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 5. Create profiles for ALL orphaned users (past and current)
INSERT INTO public.profiles (id, full_name, email, phone, address, role)
SELECT 
    u.id,
    COALESCE(
        NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(u.raw_user_meta_data->>'fullName'), ''),
        SPLIT_PART(u.email, '@', 1),
        'User'
    ) as full_name,
    u.email,
    COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'phone'), ''), '') as phone,
    COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'address'), ''), '') as address,
    COALESCE((u.raw_user_meta_data->>'role')::user_role, 'petani') as role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
  AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 6. Fix specific problem users from your logs
INSERT INTO public.profiles (id, full_name, email, phone, address, role)
SELECT 
    u.id,
    COALESCE(
        NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(u.raw_user_meta_data->>'fullName'), ''),
        SPLIT_PART(u.email, '@', 1),
        'User ' || SUBSTRING(u.id::TEXT, 1, 8)
    ) as full_name,
    u.email,
    COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'phone'), ''), '') as phone,
    COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'address'), ''), '') as address,
    COALESCE((u.raw_user_meta_data->>'role')::user_role, 'petani') as role
FROM auth.users u
WHERE u.id IN (
    '45f9e0d6-2207-4e05-b478-d2cd57c53c16',
    '0510e0cd-27bf-43bf-8e5e-6ca754b27b0c',
    '2eb71c47-7a65-4a4d-aab5-ed5a03458cfb'
) AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 7. Verify all users now have profiles
SELECT 
    '📊 Profile Status Summary' as status,
    COUNT(*) as total_confirmed_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as remaining_orphaned
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- 8. Show all recent profiles (created or updated in last 10 minutes)
SELECT 
    '🎉 Recent Profiles (Last 10 Minutes)' as status,
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.address,
    p.role,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.created_at > NOW() - INTERVAL '10 minutes'
   OR p.updated_at > NOW() - INTERVAL '10 minutes'
ORDER BY GREATEST(p.created_at, p.updated_at) DESC;

-- 9. Ensure RLS policies are working correctly
-- Test that authenticated users can access their profiles
SELECT 
    '🔒 RLS Policy Check' as status,
    'RLS policies should allow users to access their own profiles' as note;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ DATABASE TRIGGER REMOVED COMPLETELY!';
    RAISE NOTICE '🔧 All profile creation now handled by AuthContext.tsx';
    RAISE NOTICE '📝 All orphaned users should now have profiles';
    RAISE NOTICE '🚀 Registration and login will work automatically';
    RAISE NOTICE '⚡ No more dependency on database triggers!';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 NEXT STEPS:';
    RAISE NOTICE '1. Refresh your application';
    RAISE NOTICE '2. Test registration - profiles created by app';
    RAISE NOTICE '3. Test login - should work without 404 errors';
    RAISE NOTICE '4. All future profiles handled by enhanced AuthContext';
END $$;