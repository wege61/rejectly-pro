-- Add career recommendations column to reports table
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS career_recommendations JSONB;

-- Comment on column
COMMENT ON COLUMN reports.career_recommendations IS 'Stores the AI-generated career and certification recommendations for the job role';
