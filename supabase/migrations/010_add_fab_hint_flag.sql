-- Add fab_hint_completed flag to profiles table
-- This tracks if user has seen and interacted with the FAB hint
ALTER TABLE profiles
ADD COLUMN fab_hint_completed BOOLEAN DEFAULT FALSE;

-- Add index for better query performance
CREATE INDEX idx_profiles_fab_hint ON profiles(fab_hint_completed);

-- New users will see the FAB hint after welcome modal
-- Existing users will also see it once
UPDATE profiles SET fab_hint_completed = FALSE WHERE fab_hint_completed IS NULL;
