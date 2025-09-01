-- =====================================================
-- IMMEDIATE FIX FOR 404 PROFILE ERRORS
-- =====================================================
-- Run this to fix the orphaned users causing 404 errors

-- 1. Show current orphaned users
SELECT 
    '🔍 Current Orphaned Users' as status,
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
  AND u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC;

-- 2. Create profiles for ALL orphaned users (including the recent ones)
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

-- 3. Fix specific users from your logs
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
WHERE u.id IN (
    '45f9e0d6-2207-4e05-b478-d2cd57c53c16',
    '0510e0cd-27bf-43bf-8e5e-6ca754b27b0c'
) AND u.email_confirmed_at IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 4. Verify all users now have profiles
SELECT 
    '✅ Final Verification' as status,
    COUNT(*) as total_confirmed_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as remaining_orphaned
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- 5. Show the fixed profiles
SELECT 
    '🎉 Newly Created Profiles' as status,
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.address,
    p.role,
    p.created_at
FROM public.profiles p
WHERE p.created_at > NOW() - INTERVAL '5 minutes'
   OR p.updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY GREATEST(p.created_at, p.updated_at) DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All orphaned users should now have profiles!';
    RAISE NOTICE '🔄 Try refreshing your app - the 404 errors should be gone';
    RAISE NOTICE '🚀 Registration and login should work smoothly now';
END $$;