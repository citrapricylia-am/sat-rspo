-- =====================================================
-- COMPREHENSIVE FIX FOR AUTHENTICATION ISSUES
-- =====================================================
-- This script fixes orphaned users and authentication problems

-- 1. Check current situation with detailed information
SELECT 
    'Auth Users Analysis' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at,
    u.raw_user_meta_data,
    CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 15;

-- 2. Create profiles for any missing users (including recent problem users)
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

-- 3. Enhanced RLS policy fix
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles  
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow service role full access for emergency operations
CREATE POLICY "Service role full access" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Fix specific users from the logs
-- Handle users: 56eeeeff-0a8e-4640-9239-71f92a5ea5c3, 55216abd-bd8e-4f2a-b88d-3b01adda17b0
INSERT INTO public.profiles (id, full_name, email, phone, address, role)
SELECT 
    u.id,
    COALESCE(
        NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(u.raw_user_meta_data->>'fullName'), ''),
        SPLIT_PART(u.email, '@', 1)
    ) as full_name,
    u.email,
    COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'phone'), ''), '') as phone,
    COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'address'), ''), '') as address,
    COALESCE((u.raw_user_meta_data->>'role')::user_role, 'petani') as role
FROM auth.users u
WHERE u.id IN (
    '56eeeeff-0a8e-4640-9239-71f92a5ea5c3',
    '55216abd-bd8e-4f2a-b88d-3b01adda17b0'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 5. Verify the comprehensive fix
SELECT 
    'Verification Results' as status,
    COUNT(*) as total_confirmed_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as remaining_orphaned
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- 6. Show profiles for recent problem users
SELECT 
    'Problem Users Fixed' as status,
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.id IN (
    '56eeeeff-0a8e-4640-9239-71f92a5ea5c3',
    '55216abd-bd8e-4f2a-b88d-3b01adda17b0'
) OR p.created_at > NOW() - INTERVAL '10 minutes' 
   OR p.updated_at > NOW() - INTERVAL '10 minutes'
ORDER BY GREATEST(p.created_at, p.updated_at) DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Comprehensive authentication fix completed!';
    RAISE NOTICE '👥 All orphaned users should now have profiles';
    RAISE NOTICE '🔒 RLS policies updated for proper access';
    RAISE NOTICE '🚀 Registration and login should work smoothly now';
    RAISE NOTICE '⚠️ Users with existing emails should use login instead of registration';
END $$;