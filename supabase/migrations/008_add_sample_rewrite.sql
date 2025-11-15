-- Add sample_rewrite and sample_role fields to reports table for free users
-- sample_rewrite: One example of before/after bullet point rewrite
-- sample_role: One example of role recommendation with description

ALTER TABLE reports
ADD COLUMN sample_rewrite JSONB,
ADD COLUMN sample_role JSONB;

COMMENT ON COLUMN reports.sample_rewrite IS 'Sample bullet point rewrite for free users (before/after comparison)';
COMMENT ON COLUMN reports.sample_role IS 'Sample role recommendation for free users (title, fit score, description)';
