-- =====================================================
-- QUICK FIX: Function Return Type Conflict
-- =====================================================
-- 
-- This script resolves the error:
-- "ERROR: 42P13: cannot change return type of existing function"
-- 
-- Run this FIRST before running the main schema script
-- =====================================================

-- Drop the existing function that's causing the conflict
DROP FUNCTION IF EXISTS get_user_assessment_stats(UUID);

-- Success message
SELECT '✅ Function conflict resolved! You can now run the main schema script.' as message;

-- =====================================================
-- Optional: Check for any other conflicting functions
-- =====================================================

-- List all custom functions in your database
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_catalog.pg_proc p
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
  AND p.prokind = 'f'  -- Only functions, not procedures
ORDER BY schema_name, function_name;