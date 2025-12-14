-- Add score_breakdown column to reports table for systematic HR scoring
-- This stores the detailed breakdown of how the score was calculated

ALTER TABLE reports ADD COLUMN IF NOT EXISTS score_breakdown JSONB;

-- Add index for potential future queries on breakdown data
CREATE INDEX IF NOT EXISTS idx_reports_score_breakdown ON reports USING gin (score_breakdown);

-- Comment for documentation
COMMENT ON COLUMN reports.score_breakdown IS 'Detailed HR-based scoring breakdown with components (skills, experience, industry, education), penalties, and assessment verdict';
