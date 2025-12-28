-- Add ATS (Applicant Tracking System) compatibility check columns to documents table
-- These columns store standalone ATS analysis results for CVs

-- ATS score (0-100)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ats_score INTEGER;

-- Full ATS analysis breakdown (JSON)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ats_breakdown JSONB;

-- When the ATS check was performed
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ats_checked_at TIMESTAMP WITH TIME ZONE;

-- Whether the user has unlocked the full ATS report (paid feature)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ats_unlocked BOOLEAN DEFAULT FALSE;

-- Add index for faster ATS score queries
CREATE INDEX IF NOT EXISTS idx_documents_ats_score ON documents(ats_score) WHERE ats_score IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN documents.ats_score IS 'ATS compatibility score (0-100), job-independent';
COMMENT ON COLUMN documents.ats_breakdown IS 'Full ATS analysis with categories, issues, and recommendations';
COMMENT ON COLUMN documents.ats_checked_at IS 'Timestamp of last ATS check';
COMMENT ON COLUMN documents.ats_unlocked IS 'Whether user paid to unlock full ATS report';
