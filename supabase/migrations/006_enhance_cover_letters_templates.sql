-- Add template support and structured content to cover_letters table

-- Add new columns
ALTER TABLE cover_letters
ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS structured_content JSONB,
ADD COLUMN IF NOT EXISTS customization_fields JSONB;

-- Create index for template field
CREATE INDEX IF NOT EXISTS idx_cover_letters_template ON cover_letters(template);

-- Create index for JSONB fields for faster queries
CREATE INDEX IF NOT EXISTS idx_cover_letters_structured_content ON cover_letters USING GIN (structured_content);

-- Add comments for documentation
COMMENT ON COLUMN cover_letters.template IS 'Template type: standard, story_driven, technical_focus, results_oriented, career_change, short_intro';
COMMENT ON COLUMN cover_letters.structured_content IS 'Structured paragraph-based content with rationale and sentence alternatives (JSONB)';
COMMENT ON COLUMN cover_letters.customization_fields IS 'User-provided customization fields for template personalization (JSONB)';

-- Example structured_content format:
-- {
--   "paragraphs": [
--     {
--       "id": "uuid",
--       "type": "opening",
--       "content": "Full paragraph text...",
--       "rationale": "This paragraph establishes your interest and enthusiasm for the role.",
--       "sentences": [
--         {
--           "id": "uuid",
--           "text": "I am excited to apply for this position.",
--           "isHighlight": true,
--           "alternatives": [
--             "I am thrilled to apply for this opportunity.",
--             "I am enthusiastic about this role."
--           ]
--         }
--       ]
--     }
--   ],
--   "keyHighlights": ["Achievement 1", "Skill 2"],
--   "wordCount": 250
-- }

-- Example customization_fields format:
-- {
--   "emphasize_skills": ["Python", "Leadership"],
--   "specific_projects": ["E-commerce Platform"],
--   "preferred_style": "conversational",
--   "include_salary_expectations": false
-- }
