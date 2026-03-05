-- Drop the existing foreign key constraint
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

-- Add the new foreign key constraint pointing to auth.users
ALTER TABLE payments
  ADD CONSTRAINT payments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
