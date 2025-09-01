-- =====================================================
-- CHECK EXISTING USERS IN SUPABASE
-- =====================================================

-- 1. Check auth.users table
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check profiles table
SELECT 
    id,
    full_name,
    email,
    phone,
    address,
    role,
    created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check for orphaned records (users without profiles)
SELECT 
    u.id,
    u.email,
    u.created_at,
    CASE 
        WHEN p.id IS NULL THEN '❌ No Profile'
        ELSE '✅ Has Profile'
    END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 4. Count users by role
SELECT 
    role,
    COUNT(*) as user_count
FROM public.profiles 
GROUP BY role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '📊 User data summary complete!';
    RAISE NOTICE '👆 Check the results above to see existing users';
END $$;