-- The live `subscriptions` table predates migration 011 (CREATE TABLE IF NOT EXISTS
-- skipped it), so it never got `stripe_customer_id` or `plan`. Without a customer id
-- we can't open the Stripe billing portal, and every Pro checkout failed on the
-- missing `plan` column. The webhook now writes only the columns below.

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE;

-- Webhooks look rows up by these when Stripe sends renewals and cancellations.
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
