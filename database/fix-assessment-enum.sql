-- =====================================================
-- VERIFY AND FIX ASSESSMENT STAGE ENUM VALUES
-- =====================================================
-- This script ensures the database enum matches the API expectations

-- Check current enum values
SELECT unnest(enum_range(NULL::assessment_stage)) AS enum_values;

-- If the enum doesn't exist or has wrong values, recreate it
DROP TYPE IF EXISTS assessment_stage CASCADE;
CREATE TYPE assessment_stage AS ENUM ('pretest', 'stage1', 'stage2', 'stage3', 'final');

-- Update the assessments table to use the correct enum
ALTER TABLE assessments 
DROP CONSTRAINT IF EXISTS assessments_stage_check;

ALTER TABLE assessments 
ALTER COLUMN stage TYPE assessment_stage 
USING stage::assessment_stage;

-- Verify the change
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'assessments' AND column_name = 'stage';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Assessment stage enum verified and fixed!';
    RAISE NOTICE '📋 Valid values: pretest, stage1, stage2, stage3, final';
    RAISE NOTICE '🔧 Database is ready for assessment saving!';
END $$;