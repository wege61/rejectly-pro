import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface UserAccessStatus {
  canAnalyze: boolean;
  credits: number;
  hasSubscription: boolean;
  subscriptionStatus?: string;
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return 0;
  }

  return data.credits;
}

/**
 * Check if user has an active Pro subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return false;
  }

  // Check if subscription is still valid
  if (data.current_period_end) {
    const endDate = new Date(data.current_period_end);
    if (endDate < new Date()) {
      return false;
    }
  }

  return true;
}

/**
 * Get complete user access status
 */
export async function getUserAccessStatus(userId: string): Promise<UserAccessStatus> {
  const supabase = await createClient();

  // Get credits
  let credits = 0;
  try {
    const { data: creditsData, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single();

    if (!error && creditsData) {
      credits = creditsData.credits;
    }
  } catch {
    // Table might not exist yet
    credits = 0;
  }

  // Get subscription
  let hasSubscription = false;
  let subscriptionStatus: string | undefined;

  try {
    const { data: subData, error } = await supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (!error && subData) {
      subscriptionStatus = subData.status;
      if (subData.current_period_end) {
        const endDate = new Date(subData.current_period_end);
        hasSubscription = endDate >= new Date();
      } else {
        hasSubscription = subData.status === "active";
      }
    }
  } catch {
    // Table might not exist yet
    hasSubscription = false;
  }

  const canAnalyze = hasSubscription || credits > 0;

  return {
    canAnalyze,
    credits,
    hasSubscription,
    subscriptionStatus,
  };
}

/**
 * Credit balances are only ever written server-side with the service role.
 * Users must not be able to write their own row (see migration 024), otherwise
 * anyone could grant themselves credits from the browser.
 */
function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Change a user's balance by `delta` with optimistic concurrency: the update only
 * applies if the balance is still what we read, so two parallel requests can't
 * spend the same credit. Retries a few times on contention.
 */
async function changeCredits(userId: string, delta: number): Promise<boolean> {
  const supabase = adminClient();

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: current, error: readError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (readError) {
      console.error("Error reading credits:", readError);
      return false;
    }

    if (!current) {
      if (delta < 0) return false;
      const { error } = await supabase.from("user_credits").insert({ user_id: userId, credits: delta });
      if (!error) return true;
      if (error.code !== "23505") {
        console.error("Error creating credits record:", error);
        return false;
      }
      continue; // Created concurrently; retry as an update.
    }

    const next = current.credits + delta;
    if (next < 0) return false;

    const { data: updated, error } = await supabase
      .from("user_credits")
      .update({ credits: next })
      .eq("user_id", userId)
      .eq("credits", current.credits)
      .select("credits");

    if (error) {
      console.error("Error updating credits:", error);
      return false;
    }
    if (updated && updated.length > 0) return true;
  }

  console.error("Credit update kept conflicting for user", userId);
  return false;
}

/**
 * Consume one credit for an analysis
 * Returns true if successful, false if no credits available
 */
export async function consumeCredit(userId: string): Promise<boolean> {
  return changeCredits(userId, -1);
}

/**
 * Give back a credit that was consumed for work that then failed.
 */
export async function refundCredit(userId: string): Promise<void> {
  if (!(await changeCredits(userId, 1))) {
    console.error("Failed to refund credit for user", userId);
  }
}

/**
 * Add credits to user account (after purchase)
 */
export async function addCredits(userId: string, amount: number): Promise<boolean> {
  return changeCredits(userId, amount);
}

/**
 * Initialize credits for new user (optional: give free credits)
 */
export async function initializeUserCredits(userId: string, initialCredits: number = 0): Promise<boolean> {
  const { error } = await adminClient()
    .from("user_credits")
    .insert({ user_id: userId, credits: initialCredits });

  if (error) {
    // Might already exist
    if (error.code === "23505") {
      return true; // Already initialized
    }
    console.error("Error initializing credits:", error);
    return false;
  }

  return true;
}
