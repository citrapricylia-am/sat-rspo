-- Quick Fix for Login Timeout Issues
-- Run this in Supabase SQL Editor if login timeouts persist

-- 1. Check for orphaned auth users without profiles
SELECT 
    u.id,
    u.email,
    u.created_at as auth_created,
    p.id as profile_exists
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
LIMIT 10;

-- 2. Create missing profiles for orphaned users (if any found above)
-- UNCOMMENT AND RUN ONLY IF ORPHANED USERS FOUND:
/*
INSERT INTO public.profiles (id, full_name, email, phone, address, role)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'User'),
    u.email,
    COALESCE(u.raw_user_meta_data->>'phone', ''),
    COALESCE(u.raw_user_meta_data->>'address', ''),
    COALESCE((u.raw_user_meta_data->>'role')::user_role, 'petani')
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
*/

-- 3. Verify RLS policies are working correctly
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'assessments')
ORDER BY tablename, policyname;

-- 4. Check if trigger function is working
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 5. Test profile access for current auth context
-- (This will only work when run by an authenticated user)
SELECT 
    id,
    full_name,
    email,
    role,
    created_at
FROM profiles
WHERE id = auth.uid()
LIMIT 1;