-- Emergency Profile Creation for User: citrapricylia@gmail.com
-- Run this in Supabase SQL Editor to manually create the missing profile

-- First, check if the user exists in auth.users but not in profiles
SELECT 
    u.id as auth_user_id,
    u.email,
    u.created_at,
    u.raw_user_meta_data,
    p.id as profile_id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'citrapricylia@gmail.com';

-- If the user exists in auth.users but profile_id is NULL, run this INSERT:
INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone, 
    address, 
    role,
    created_at,
    updated_at
)
SELECT 
    u.id,
    COALESCE(
        u.raw_user_meta_data->>'full_name', 
        u.raw_user_meta_data->>'fullName', 
        u.email
    ) as full_name,
    u.email,
    COALESCE(u.raw_user_meta_data->>'phone', '') as phone,
    COALESCE(u.raw_user_meta_data->>'address', '') as address,
    COALESCE(
        (u.raw_user_meta_data->>'role')::user_role, 
        'petani'::user_role
    ) as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users u
WHERE u.email = 'citrapricylia@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- Verify the profile was created
SELECT 
    id,
    full_name,
    email,
    phone,
    address,
    role,
    created_at
FROM public.profiles 
WHERE email = 'citrapricylia@gmail.com';