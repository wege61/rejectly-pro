-- Create optimized_cvs table to store AI-generated optimized CVs
-- Each report can have an associated optimized CV with its own PDF file

CREATE TABLE optimized_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  original_cv_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  text TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE optimized_cvs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own optimized CVs
CREATE POLICY "Users can view their own optimized CVs"
  ON optimized_cvs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own optimized CVs
CREATE POLICY "Users can insert their own optimized CVs"
  ON optimized_cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own optimized CVs
CREATE POLICY "Users can update their own optimized CVs"
  ON optimized_cvs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own optimized CVs
CREATE POLICY "Users can delete their own optimized CVs"
  ON optimized_cvs FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes for better query performance
CREATE INDEX idx_optimized_cvs_user_id ON optimized_cvs(user_id);
CREATE INDEX idx_optimized_cvs_report_id ON optimized_cvs(report_id);
CREATE INDEX idx_optimized_cvs_original_cv_id ON optimized_cvs(original_cv_id);
CREATE INDEX idx_optimized_cvs_created_at ON optimized_cvs(created_at DESC);

-- Add unique constraint to prevent duplicates (one optimized CV per report)
CREATE UNIQUE INDEX idx_optimized_cvs_unique_report ON optimized_cvs(report_id);

-- Add comments
COMMENT ON TABLE optimized_cvs IS 'Stores AI-generated optimized CVs with PDF files';
COMMENT ON COLUMN optimized_cvs.report_id IS 'The report that generated this optimized CV';
COMMENT ON COLUMN optimized_cvs.original_cv_id IS 'The original CV that this optimized version is based on';
COMMENT ON COLUMN optimized_cvs.file_url IS 'Supabase storage URL for the optimized CV PDF';
COMMENT ON COLUMN optimized_cvs.text IS 'Full text content of the optimized CV';

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_optimized_cvs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER optimized_cvs_updated_at
  BEFORE UPDATE ON optimized_cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_optimized_cvs_updated_at();
