-- Drop the restrictive service role policy
DROP POLICY IF EXISTS "Service can insert credits" ON user_credits;

-- Create a new policy that explicitly allows the service role completely without uid matching
CREATE POLICY "Service Role Full Access" ON user_credits
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
