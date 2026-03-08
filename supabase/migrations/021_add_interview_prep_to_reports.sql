-- Add interview_prep JSONB column to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS interview_prep JSONB DEFAULT NULL;
