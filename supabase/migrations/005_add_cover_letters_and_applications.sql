-- Add cover_letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  job_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  tone VARCHAR(50) DEFAULT 'professional', -- professional, friendly, formal
  length VARCHAR(50) DEFAULT 'medium', -- short, medium, long
  language VARCHAR(10) DEFAULT 'en', -- en, tr
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add applications table for job tracking
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  cv_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  cover_letter_id UUID REFERENCES cover_letters(id) ON DELETE SET NULL,

  company_name VARCHAR(255) NOT NULL,
  position_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'applied', -- applied, screening, interview, offer, rejected, withdrawn

  applied_date DATE,
  deadline_date DATE,
  interview_date TIMESTAMP WITH TIME ZONE,

  notes TEXT,
  salary_range VARCHAR(100),
  location VARCHAR(255),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_cover_letters_report_id ON cover_letters(report_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_deadline_date ON applications(deadline_date);

-- Add RLS (Row Level Security) policies
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Cover letters policies
CREATE POLICY "Users can view their own cover letters"
  ON cover_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
  ON cover_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
  ON cover_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
  ON cover_letters FOR DELETE
  USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON applications FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE cover_letters IS 'Stores AI-generated cover letters for job applications';
COMMENT ON TABLE applications IS 'Tracks job applications with kanban-style status management';

COMMENT ON COLUMN cover_letters.tone IS 'Tone of the cover letter: professional, friendly, or formal';
COMMENT ON COLUMN cover_letters.length IS 'Length of cover letter: short (150 words), medium (250 words), long (350 words)';
COMMENT ON COLUMN applications.status IS 'Current status: applied, screening, interview, offer, rejected, withdrawn';
