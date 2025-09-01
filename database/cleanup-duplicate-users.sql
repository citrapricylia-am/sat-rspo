-- =====================================================
-- CLEANUP DUPLICATE AND PROBLEM USERS
-- =====================================================
-- Run this if you need to clean up duplicate test users

-- 1. Show users with duplicate emails (if any)
SELECT 
    email,
    COUNT(*) as user_count,
    array_agg(id) as user_ids
FROM auth.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 2. Show unconfirmed users older than 1 hour (candidates for cleanup)
SELECT 
    'Unconfirmed Users' as status,
    id,
    email,
    created_at,
    'Ready for cleanup' as action
FROM auth.users 
WHERE email_confirmed_at IS NULL 
  AND created_at < NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 3. Clean up unconfirmed users older than 1 hour (UNCOMMENT ONLY IF NEEDED)
/*
DELETE FROM auth.users 
WHERE email_confirmed_at IS NULL 
  AND created_at < NOW() - INTERVAL '1 hour';
*/

-- 4. Show current confirmed users and their profile status
SELECT 
    'Confirmed Users Status' as status,
    u.id,
    u.email,
    u.created_at,
    CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Cleanup analysis complete!';
    RAISE NOTICE '🧹 Review the results and uncomment cleanup queries if needed';
END $$;