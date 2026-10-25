import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

/*
 * Stripe is the source of truth for Pro subscriptions. Every subscription webhook
 * re-reads the subscription from Stripe and copies its status and billing period
 * into our `subscriptions` row, so events can arrive late, twice or out of order
 * and the row still ends up matching Stripe.
 */

export function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const idOf = (value: string | { id: string } | null | undefined) =>
  typeof value === 'string' ? value : value?.id ?? null;

/** Find which of our users a Stripe subscription belongs to. */
async function findUserId(sub: Stripe.Subscription, hint?: string): Promise<string | null> {
  if (hint) return hint;
  if (sub.metadata?.userId) return sub.metadata.userId;

  const supabase = adminClient();
  const customerId = idOf(sub.customer);

  const bySub = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', sub.id)
    .maybeSingle();
  if (bySub.data) return bySub.data.user_id;

  if (customerId) {
    const byCustomer = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
    if (byCustomer.data) return byCustomer.data.user_id;
  }

  return null;
}

/*
 * The app grants Pro only to status 'active'. The live table has a check constraint
 * allowing just active / past_due / unpaid / cancelled / expired, so Stripe's
 * statuses are folded into those.
 */
function toRowStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
      return 'cancelled';
    case 'incomplete_expired':
      return 'expired';
    default: // unpaid, incomplete (first payment not done), paused
      return 'unpaid';
  }
}

export type SyncResult =
  | { ok: true; userId: string; status: string; periodEnd: Date | null }
  | { ok: false; reason: 'unknown-user' | 'db-error' };

/**
 * Copy a Stripe subscription onto the user's `subscriptions` row.
 * `userIdHint` comes from checkout metadata when we have it.
 */
export async function syncSubscription(subscriptionId: string, userIdHint?: string): Promise<SyncResult> {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = await findUserId(sub, userIdHint);

  if (!userId) {
    console.warn(`No user found for Stripe subscription ${sub.id}`);
    return { ok: false, reason: 'unknown-user' };
  }

  // Since API version 2025-03-31 the billing period lives on the subscription item.
  const item = sub.items.data[0];
  const periodStart = item?.current_period_start ? new Date(item.current_period_start * 1000) : null;
  const periodEnd = item?.current_period_end ? new Date(item.current_period_end * 1000) : null;

  const status = toRowStatus(sub.status);

  const row = {
    stripe_customer_id: idOf(sub.customer),
    stripe_subscription_id: sub.id,
    status,
    cancel_at_period_end: sub.cancel_at_period_end,
    current_period_start: periodStart?.toISOString() ?? null,
    current_period_end: periodEnd?.toISOString() ?? null,
    updated_at: new Date().toISOString(),
  };

  const supabase = adminClient();
  const { data: existing, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id, stripe_subscription_id, status')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching subscription row:', fetchError);
    return { ok: false, reason: 'db-error' };
  }

  // A late event about an older, ended subscription must not overwrite a newer active one.
  if (existing?.stripe_subscription_id && existing.stripe_subscription_id !== sub.id && existing.status === 'active' && status !== 'active') {
    console.log(`Ignoring ${status} subscription ${sub.id}; user ${userId} is active on ${existing.stripe_subscription_id}`);
    return { ok: true, userId, status: existing.status, periodEnd: null };
  }

  const { error } = existing
    ? await supabase.from('subscriptions').update(row).eq('id', existing.id)
    : await supabase.from('subscriptions').insert({ user_id: userId, ...row });

  if (error) {
    console.error('Error saving subscription row:', error);
    return { ok: false, reason: 'db-error' };
  }

  console.log(`Synced subscription ${sub.id} for user ${userId}: ${status}, ends ${row.current_period_end}`);
  return { ok: true, userId, status, periodEnd };
}

/** The Stripe customer for a user, from our row or (for older checkouts) by email. */
export async function findStripeCustomerId(userId: string, email?: string | null): Promise<string | null> {
  const { data } = await adminClient()
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id;

  if (!email) return null;
  const customers = await stripe.customers.list({ email, limit: 1 });
  return customers.data[0]?.id ?? null;
}
