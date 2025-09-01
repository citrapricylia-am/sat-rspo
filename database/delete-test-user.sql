-- =====================================================
-- DELETE TEST USER FOR RE-REGISTRATION
-- =====================================================
-- CAUTION: This will permanently delete the user and their data

-- 1. Find the user ID for the email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'test@gmail.com';

-- 2. Delete the user profile first (if exists)
DELETE FROM public.profiles 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'test@gmail.com'
);

-- 3. Delete any assessment data
DELETE FROM public.assessments 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'test@gmail.com'
);

-- 4. Delete the auth user (this will cascade to other related tables)
DELETE FROM auth.users 
WHERE email = 'test@gmail.com';

-- 5. Verify deletion
SELECT 'User deleted successfully' as result
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'test@gmail.com'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Test user deleted successfully!';
    RAISE NOTICE '🔄 You can now register with test@gmail.com again';
END $$;