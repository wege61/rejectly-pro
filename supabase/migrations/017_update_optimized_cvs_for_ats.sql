-- Update optimized_cvs table for ATS optimizer
-- Make report_id nullable and add new columns for ATS optimization tracking

-- Make report_id nullable (ATS optimizer doesn't use reports)
ALTER TABLE optimized_cvs ALTER COLUMN report_id DROP NOT NULL;

-- Make title nullable with default
ALTER TABLE optimized_cvs ALTER COLUMN title DROP NOT NULL;
ALTER TABLE optimized_cvs ALTER COLUMN title SET DEFAULT 'Optimized CV';

-- Make text nullable (we store JSON in it, not always needed)
ALTER TABLE optimized_cvs ALTER COLUMN text DROP NOT NULL;
ALTER TABLE optimized_cvs ALTER COLUMN text SET DEFAULT '';

-- Add new columns for ATS optimization tracking
ALTER TABLE optimized_cvs ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE optimized_cvs ADD COLUMN IF NOT EXISTS before_score INTEGER;
ALTER TABLE optimized_cvs ADD COLUMN IF NOT EXISTS after_score INTEGER;
ALTER TABLE optimized_cvs ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'ats-optimizer';
ALTER TABLE optimized_cvs ADD COLUMN IF NOT EXISTS ats_result JSONB;
ALTER TABLE optimized_cvs ADD COLUMN IF NOT EXISTS changes JSONB;

-- Add index for source column
CREATE INDEX IF NOT EXISTS idx_optimized_cvs_source ON optimized_cvs(source);

-- Drop the unique constraint on report_id since it can now be null
DROP INDEX IF EXISTS idx_optimized_cvs_unique_report;

-- Add comments
COMMENT ON COLUMN optimized_cvs.contact_name IS 'Name extracted from the CV for display purposes';
COMMENT ON COLUMN optimized_cvs.before_score IS 'ATS score before optimization';
COMMENT ON COLUMN optimized_cvs.after_score IS 'ATS score after optimization';
COMMENT ON COLUMN optimized_cvs.source IS 'Source of optimization: ats-optimizer or reports';
