-- =====================================================
-- COMPREHENSIVE FIX FOR ORPHANED USERS
-- =====================================================
-- This script fixes users who exist in auth.users but not in profiles
-- Also handles authentication and profile creation issues

-- 1. Find orphaned users (in auth but no profile)
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data,
    u.email_confirmed_at,
    'ORPHANED - No Profile' as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- 2. Create profiles for orphaned users with enhanced data handling
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
    COALESCE(
        (u.raw_user_meta_data->>'role')::user_role, 
        'petani'
    ) as role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
  AND u.email_confirmed_at IS NOT NULL  -- Only create profiles for confirmed users
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. Fix any RLS policy issues by ensuring proper policies exist
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to manage profiles
CREATE POLICY "Service role full access" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- 4. Verify all users now have profiles
SELECT 
    COUNT(*) as total_confirmed_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as remaining_orphaned_users
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL;

-- 5. Show users created/updated in the last 5 minutes
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.address,
    p.role,
    p.created_at,
    p.updated_at,
    CASE 
        WHEN p.created_at > NOW() - INTERVAL '5 minutes' THEN 'NEWLY CREATED'
        WHEN p.updated_at > NOW() - INTERVAL '5 minutes' THEN 'RECENTLY UPDATED'
        ELSE 'EXISTING'
    END as status
FROM public.profiles p
WHERE p.created_at > NOW() - INTERVAL '5 minutes' 
   OR p.updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY GREATEST(p.created_at, p.updated_at) DESC;

-- 6. Clean up any invalid auth users (no email confirmation after 24 hours)
-- This is optional and should be used carefully
/*
DELETE FROM auth.users 
WHERE email_confirmed_at IS NULL 
  AND created_at < NOW() - INTERVAL '24 hours';
*/

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Comprehensive orphaned users fix completed!';
    RAISE NOTICE '👥 All confirmed auth users now have corresponding profiles';
    RAISE NOTICE '🔒 RLS policies updated for better security';
    RAISE NOTICE '🔧 Login should work without 404 errors';
    RAISE NOTICE '⚠️ Test login flow after running this script';
END $$;