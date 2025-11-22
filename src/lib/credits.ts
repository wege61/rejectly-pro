import { createClient } from "@/lib/supabase/server";

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
 * Consume one credit for an analysis
 * Returns true if successful, false if no credits available
 */
export async function consumeCredit(userId: string): Promise<boolean> {
  const supabase = await createClient();

  // First check current credits
  const { data: currentData } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (!currentData || currentData.credits <= 0) {
    return false;
  }

  // Decrement credit
  const { error } = await supabase
    .from("user_credits")
    .update({ credits: currentData.credits - 1 })
    .eq("user_id", userId);

  if (error) {
    console.error("Error consuming credit:", error);
    return false;
  }

  return true;
}

/**
 * Add credits to user account (after purchase)
 */
export async function addCredits(userId: string, amount: number): Promise<boolean> {
  const supabase = await createClient();

  // Check if user has credits record
  const { data: existing } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from("user_credits")
      .update({ credits: existing.credits + amount })
      .eq("user_id", userId);

    if (error) {
      console.error("Error adding credits:", error);
      return false;
    }
  } else {
    // Create new record
    const { error } = await supabase
      .from("user_credits")
      .insert({ user_id: userId, credits: amount });

    if (error) {
      console.error("Error creating credits record:", error);
      return false;
    }
  }

  return true;
}

/**
 * Initialize credits for new user (optional: give free credits)
 */
export async function initializeUserCredits(userId: string, initialCredits: number = 0): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
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
