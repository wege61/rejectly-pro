-- Add has_seen_welcome_modal flag to profiles table
ALTER TABLE profiles
ADD COLUMN has_seen_welcome_modal BOOLEAN DEFAULT FALSE;

-- Add index for better query performance
CREATE INDEX idx_profiles_welcome_modal ON profiles(has_seen_welcome_modal);

-- Update existing users to show welcome modal on their next login
-- (set to FALSE for all existing users so they see it once)
UPDATE profiles SET has_seen_welcome_modal = FALSE WHERE has_seen_welcome_modal IS NULL;
