-- =====================================================
-- QUICK FIX FOR STUCK REGISTRATION - RUN THIS NOW
-- =====================================================
-- This is a simplified version for immediate problem resolution

-- 1. Check current situation
SELECT 
    'Current Auth Users' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- 2. Create profiles for any missing users (including the ones causing 404 errors)
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
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. Simple RLS policy fix
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles  
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. Verify fix
SELECT 
    'Verification' as status,
    COUNT(*) as total_users,
    COUNT(p.id) as users_with_profiles,
    COUNT(*) - COUNT(p.id) as still_missing
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Quick fix applied!';
    RAISE NOTICE '🔄 Try registration again now';
    RAISE NOTICE '⚡ This should resolve the loading stuck issue';
END $$;