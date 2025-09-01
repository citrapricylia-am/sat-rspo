-- =====================================================
-- EMERGENCY FIX FOR AUTHENTICATION ISSUES
-- =====================================================
-- Run this script immediately in Supabase SQL Editor

-- 1. Check current orphaned users
SELECT 
    'Orphaned Users Check' as action,
    u.id,
    u.email,
    u.email_confirmed_at,
    CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC;

-- 2. Create profiles for users who are authenticated but missing profiles
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

-- 3. Fix RLS policies (simplified version)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;

-- Create simple, working RLS policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. Verify the fix
SELECT 
    'Verification Results' as action,
    COUNT(*) as total_confirmed_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as remaining_orphaned
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- 5. Show recently created/updated profiles
SELECT 
    'Recent Profile Changes' as action,
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE p.created_at > NOW() - INTERVAL '10 minutes' 
   OR p.updated_at > NOW() - INTERVAL '10 minutes'
ORDER BY GREATEST(p.created_at, p.updated_at) DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Emergency fix completed!';
    RAISE NOTICE '🔧 Test registration and login now';
END $$;