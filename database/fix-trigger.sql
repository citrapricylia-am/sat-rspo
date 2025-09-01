-- =====================================================
-- TROUBLESHOOTING SCRIPT FOR REGISTRATION ISSUE
-- =====================================================
-- Run this in Supabase SQL Editor to fix trigger issues

-- First, let's recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role_value user_role;
BEGIN
    -- Convert role string to enum with proper handling
    BEGIN
        user_role_value := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'petani');
    EXCEPTION 
        WHEN invalid_text_representation THEN
            user_role_value := 'petani'; -- Default fallback
    END;

    -- Insert into profiles with error handling
    INSERT INTO public.profiles (id, full_name, email, phone, address, role)
    VALUES (
        NEW.id,
        COALESCE(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
        NEW.email,
        COALESCE(TRIM(NEW.raw_user_meta_data->>'phone'), ''),
        COALESCE(TRIM(NEW.raw_user_meta_data->>'address'), ''),
        user_role_value
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth process
        RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test query to check if everything is set up correctly
SELECT 
    'Tables created' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'assessments', 'login_history')

UNION ALL

SELECT 
    'Trigger function exists' as status,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user'

UNION ALL

SELECT 
    'Trigger exists' as status,
    COUNT(*) as count
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Trigger function updated with better error handling!';
    RAISE NOTICE '🔧 Try registration again now.';
END $$;