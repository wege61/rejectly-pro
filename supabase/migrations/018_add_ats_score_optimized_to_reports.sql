-- Add ATS score and breakdown columns for optimized CV to reports table
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS ats_score_optimized NUMERIC,
ADD COLUMN IF NOT EXISTS ats_breakdown_optimized JSONB;
