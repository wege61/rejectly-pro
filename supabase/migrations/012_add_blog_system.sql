-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  featured_image_alt TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'Rejectly Team',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 5,
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  canonical_url TEXT,
  og_image TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blog_post_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON blog_post_tags(tag_id);

-- Enable RLS (Row Level Security)
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Public read access for published blog content
CREATE POLICY "Public can view categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view post tags" ON blog_post_tags
  FOR SELECT USING (true);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Resume Tips', 'resume-tips', 'Expert advice on crafting the perfect resume'),
  ('Career Advice', 'career-advice', 'Guidance for career growth and job searching'),
  ('ATS Optimization', 'ats-optimization', 'Tips for passing Applicant Tracking Systems'),
  ('Interview Prep', 'interview-prep', 'Prepare for your next job interview'),
  ('Industry Insights', 'industry-insights', 'Trends and news from various industries')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
  ('Resume', 'resume'),
  ('Cover Letter', 'cover-letter'),
  ('ATS', 'ats'),
  ('Job Search', 'job-search'),
  ('Career Change', 'career-change'),
  ('Remote Work', 'remote-work'),
  ('Tech Industry', 'tech-industry'),
  ('Entry Level', 'entry-level'),
  ('Executive', 'executive'),
  ('LinkedIn', 'linkedin')
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_updated_at();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views_count = views_count + 1
  WHERE slug = post_slug AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
