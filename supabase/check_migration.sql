-- Check if migration columns exist
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name IN ('optimized_score', 'improvement_breakdown', 'generated_cv')
ORDER BY column_name;

-- If columns don't exist, run this migration:
/*
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS optimized_score INTEGER CHECK (optimized_score >= 0 AND optimized_score <= 100),
ADD COLUMN IF NOT EXISTS improvement_breakdown JSONB;

COMMENT ON COLUMN reports.optimized_score IS 'Match score of the optimized CV (cached from AI analysis)';
COMMENT ON COLUMN reports.improvement_breakdown IS 'Detailed breakdown of improvements with impact values (cached from AI analysis)';

CREATE INDEX IF NOT EXISTS idx_reports_optimized_score ON reports(optimized_score) WHERE optimized_score IS NOT NULL;
*/

-- Check if any reports have cached data
SELECT
    id,
    fit_score,
    optimized_score,
    CASE
        WHEN improvement_breakdown IS NULL THEN 'NULL'
        WHEN improvement_breakdown = 'null'::jsonb THEN 'null JSON'
        ELSE jsonb_array_length(improvement_breakdown)::text || ' items'
    END as breakdown_status,
    created_at
FROM reports
WHERE generated_cv IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
