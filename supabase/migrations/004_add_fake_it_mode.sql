-- Add fake_it_mode column to reports table
-- This column tracks whether the CV was generated using "Fake it until you make it" mode

ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fake_it_mode BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN reports.fake_it_mode IS 'Indicates if CV was generated with fake it mode (adding skills candidate does not have yet)';
