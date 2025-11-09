-- Add fake_skills_recommendations column to reports table
-- This column stores learning recommendations for skills added via "Fake it until you make it" mode

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fake_skills_recommendations JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN reports.fake_skills_recommendations IS 'Learning recommendations for skills added through fake it mode. Each recommendation includes skill name, category, learning path, project ideas, and estimated time.';
