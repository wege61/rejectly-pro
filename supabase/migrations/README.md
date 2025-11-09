# Database Migrations

## Latest Migration: 004_add_fake_it_mode.sql

This migration adds support for tracking "Fake it until you make it" mode.

### What it does:
- Adds `fake_it_mode` column to track if CV was generated with fake skills

### How to run:

#### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste this SQL:
```sql
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fake_it_mode BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN reports.fake_it_mode IS 'Indicates if CV was generated with fake it mode';
```
4. Click **Run**

#### Verification
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name = 'fake_it_mode';
```

---

## Previous Migration: 003_add_fake_skills_recommendations.sql

This migration adds support for "Fake it until you make it" feature.

### What it does:
- Adds `fake_skills_recommendations` column to store learning paths for added skills

### How to run:

#### Supabase Dashboard SQL:
```sql
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS fake_skills_recommendations JSONB DEFAULT NULL;

COMMENT ON COLUMN reports.fake_skills_recommendations IS 'Learning recommendations for skills added through fake it mode.';
```

#### Verification
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name = 'fake_skills_recommendations';
```

---

## Previous Migration: 002_add_optimized_analysis.sql

This migration adds caching support for optimized CV analysis results.

### What it does:
- Adds `optimized_score` column to store cached match score
- Adds `improvement_breakdown` column to store cached improvement details
- Adds index for faster queries

### How to run:

#### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/002_add_optimized_analysis.sql`
4. Paste and run the SQL

#### Option 2: Supabase CLI
```bash
# If using Supabase CLI
supabase db push
```

#### Option 3: Manual SQL
```sql
-- Run this SQL in your database
ALTER TABLE reports
ADD COLUMN optimized_score INTEGER CHECK (optimized_score >= 0 AND optimized_score <= 100),
ADD COLUMN improvement_breakdown JSONB;

COMMENT ON COLUMN reports.optimized_score IS 'Match score of the optimized CV (cached from AI analysis)';
COMMENT ON COLUMN reports.improvement_breakdown IS 'Detailed breakdown of improvements with impact values (cached from AI analysis)';

CREATE INDEX idx_reports_optimized_score ON reports(optimized_score) WHERE optimized_score IS NOT NULL;
```

### Is this migration required?

**No, but highly recommended!**

- Without migration: App works fine, but no caching (slower page loads, higher AI costs)
- With migration: Instant page loads for returning users, 90% cost savings

### Backward Compatibility

The code is backward compatible. If you don't run the migration:
- CV generation still works ✅
- Analysis still works ✅
- Cache feature is disabled (gracefully handled)
- No errors or crashes

### When to run:

Run this migration **before** deploying the latest code for best performance.
If you deploy first, the app will work but without caching benefits.

### Verification

After running the migration, verify in SQL Editor:
```sql
-- Check columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reports'
AND column_name IN ('optimized_score', 'improvement_breakdown');

-- Should return 2 rows
```
