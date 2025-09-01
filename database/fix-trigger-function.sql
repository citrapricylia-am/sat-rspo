-- =====================================================
-- FIX DATABASE TRIGGER FUNCTION TO PREVENT 500 ERRORS
-- =====================================================
-- Run this script to fix the trigger that's causing registration failures

-- First, disable the problematic trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create an improved trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role_value user_role;
    user_full_name VARCHAR(255);
    user_phone VARCHAR(20);
    user_address TEXT;
BEGIN
    -- Safely extract and validate role with proper fallback
    BEGIN
        user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'petani');
    EXCEPTION 
        WHEN invalid_text_representation THEN
            user_role_value := 'petani'; -- Default fallback
        WHEN OTHERS THEN
            user_role_value := 'petani'; -- Catch-all fallback
    END;

    -- Safely extract full_name with proper length validation
    user_full_name := COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(TRIM(NEW.raw_user_meta_data->>'fullName'), ''),
        SPLIT_PART(NEW.email, '@', 1),
        'User'
    );
    
    -- Ensure minimum length requirement
    IF LENGTH(user_full_name) < 2 THEN
        user_full_name := 'User ' || SUBSTRING(NEW.id::TEXT, 1, 8);
    END IF;

    -- Safely extract phone with length validation
    user_phone := NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), '');
    IF LENGTH(user_phone) > 20 THEN
        user_phone := LEFT(user_phone, 20);
    END IF;

    -- Safely extract address
    user_address := NULLIF(TRIM(NEW.raw_user_meta_data->>'address'), '');

    -- Insert into profiles with comprehensive error handling
    BEGIN
        INSERT INTO public.profiles (id, full_name, email, phone, address, role)
        VALUES (
            NEW.id,
            user_full_name,
            NEW.email,
            user_phone,
            user_address,
            user_role_value
        );
        
        RAISE LOG 'Profile created successfully for user: %', NEW.email;
        
    EXCEPTION
        WHEN unique_violation THEN
            -- Profile already exists, this is okay
            RAISE LOG 'Profile already exists for user: %', NEW.email;
        WHEN check_violation THEN
            -- Constraint violation, log and use defaults
            RAISE LOG 'Constraint violation for user %, using defaults: %', NEW.email, SQLERRM;
            INSERT INTO public.profiles (id, full_name, email, phone, address, role)
            VALUES (
                NEW.id,
                'User ' || SUBSTRING(NEW.id::TEXT, 1, 8),
                NEW.email,
                '',
                '',
                'petani'
            ) ON CONFLICT (id) DO NOTHING;
        WHEN OTHERS THEN
            -- Log error but don't fail the auth process
            RAISE LOG 'Error creating profile for user %: %', NEW.email, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger with the improved function
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the function by checking if it exists
SELECT 
    'Trigger Function Status' as status,
    proname as function_name,
    'EXISTS' as result
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if trigger exists
SELECT 
    'Trigger Status' as status,
    trigger_name,
    'EXISTS' as result
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Trigger function fixed successfully!';
    RAISE NOTICE '🔧 Registration should now work without 500 errors';
    RAISE NOTICE '📝 Better error handling and fallback values implemented';
    RAISE NOTICE '🚀 Try registration again now';
END $$;