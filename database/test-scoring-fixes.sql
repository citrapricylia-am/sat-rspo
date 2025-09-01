-- =====================================================
-- TEST SCORING FIXES AND DATABASE SAVING
-- =====================================================
-- This script helps verify the fixes are working

-- 1. Check if assessments table exists and has correct structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'assessments' 
ORDER BY ordinal_position;

-- 2. Check assessment_stage enum values
SELECT unnest(enum_range(NULL::assessment_stage)) AS valid_stage_values;

-- 3. Check for any existing assessment records
SELECT 
    user_id,
    stage,
    total_score,
    max_score,
    percentage,
    completed_at,
    created_at
FROM assessments 
ORDER BY created_at DESC
LIMIT 10;

-- 4. Test insert with correct stage format
INSERT INTO assessments (
    user_id, 
    stage, 
    answers_json, 
    total_score, 
    max_score, 
    completed_at
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- dummy UUID for testing
    'stage1'::assessment_stage,
    '{"test": "data"}'::jsonb,
    100,
    100,
    NOW()
) ON CONFLICT (user_id, stage) DO UPDATE SET
    total_score = EXCLUDED.total_score,
    max_score = EXCLUDED.max_score,
    completed_at = EXCLUDED.completed_at;

-- 5. Verify the test record and calculated percentage
SELECT 
    stage,
    total_score,
    max_score,
    percentage,
    CASE 
        WHEN total_score = max_score AND percentage = 100 THEN '✅ CORRECT'
        ELSE '❌ CALCULATION ERROR'
    END as percentage_check
FROM assessments 
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- 6. Clean up test record
DELETE FROM assessments WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database structure verification complete!';
    RAISE NOTICE '📊 Scoring calculation should now show 100%% when max score is achieved';
    RAISE NOTICE '💾 Assessment saving should work for all stages';
END $$;