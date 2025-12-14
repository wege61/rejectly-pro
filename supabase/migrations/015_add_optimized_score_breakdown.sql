-- Add optimized_score_breakdown column to reports table
-- This stores the detailed breakdown of how the optimized CV score was calculated

ALTER TABLE reports ADD COLUMN IF NOT EXISTS optimized_score_breakdown JSONB;

-- Add index for potential future queries on breakdown data
CREATE INDEX IF NOT EXISTS idx_reports_optimized_score_breakdown ON reports USING gin (optimized_score_breakdown);

-- Comment for documentation
COMMENT ON COLUMN reports.optimized_score_breakdown IS 'Detailed HR-based scoring breakdown for the optimized CV with components (skills, experience, industry, education), penalties, and assessment verdict';
