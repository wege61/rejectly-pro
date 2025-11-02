-- Add generated_cv field to reports table
-- This will store the AI-generated optimized CV content

ALTER TABLE reports
ADD COLUMN generated_cv JSONB;

-- Add comment to document the field
COMMENT ON COLUMN reports.generated_cv IS 'AI-generated optimized CV content based on analysis results';
