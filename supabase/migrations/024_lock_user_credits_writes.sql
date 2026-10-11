-- Users could update their own credit balance directly from the browser
-- ("Users can update own credits" had no column or value restriction), which let
-- anyone grant themselves unlimited credits. All credit writes now happen
-- server-side with the service role (src/lib/credits.ts), so users only keep
-- read access to their own row.
--
-- Deploy the app version that writes credits with the service role BEFORE
-- running this migration.

DROP POLICY IF EXISTS "Users can update own credits" ON user_credits;
DROP POLICY IF EXISTS "Service can insert credits" ON user_credits;

-- Balances can never go negative, whatever writes them.
ALTER TABLE user_credits
  DROP CONSTRAINT IF EXISTS user_credits_non_negative;
ALTER TABLE user_credits
  ADD CONSTRAINT user_credits_non_negative CHECK (credits >= 0) NOT VALID;
