-- Add optimized CV analysis fields to reports table
-- These fields cache the analysis results to avoid re-analyzing on every page load

ALTER TABLE reports
ADD COLUMN optimized_score INTEGER CHECK (optimized_score >= 0 AND optimized_score <= 100),
ADD COLUMN improvement_breakdown JSONB;

-- Add comments to document the fields
COMMENT ON COLUMN reports.optimized_score IS 'Match score of the optimized CV (cached from AI analysis)';
COMMENT ON COLUMN reports.improvement_breakdown IS 'Detailed breakdown of improvements with impact values (cached from AI analysis)';

-- Add index for faster queries when filtering by optimized_score
CREATE INDEX idx_reports_optimized_score ON reports(optimized_score) WHERE optimized_score IS NOT NULL;
