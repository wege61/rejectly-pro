-- Add metric-related columns to reports table
ALTER TABLE reports
ADD COLUMN metric_questions JSONB,
ADD COLUMN user_provided_metrics JSONB;

-- Comment for table columns
COMMENT ON COLUMN reports.metric_questions IS 'AI generated questions to extract missing metrics from user';
COMMENT ON COLUMN reports.user_provided_metrics IS 'User answers/provided metrics for CV generation';
