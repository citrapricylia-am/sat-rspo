-- =====================================================
-- DISABLE PROBLEMATIC TRIGGER TO ALLOW REGISTRATION
-- =====================================================
-- Run this first to stop the 500 error

-- Disable the trigger that's causing the 500 error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Also drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Trigger disabled successfully!';
    RAISE NOTICE '🔧 Registration should now work without 500 error.';
    RAISE NOTICE '📝 Profiles will be created manually by the application.';
END $$;