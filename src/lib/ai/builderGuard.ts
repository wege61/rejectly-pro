import { NextResponse } from "next/server";
import rateLimit from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

/**
 * The CV Builder's AI helpers are open to signed-out visitors (only the
 * download needs an account), so without limits anyone could use them as a
 * free proxy to our OpenAI key. Cap request size and requests per hour.
 *
 * Counts are shared across instances via the database (see lib/rate-limit),
 * falling back to per-instance memory if it is unavailable.
 */

const MAX_BODY_CHARS = 20_000;
const LIMIT_PER_HOUR_SIGNED_OUT = 30;
const LIMIT_PER_HOUR_SIGNED_IN = 150;

const limiter = rateLimit({ name: "builder-ai", interval: 60 * 60 * 1000, uniqueTokenPerInterval: 2000 });

export async function guardBuilderAIRequest<T = Record<string, unknown>>(
  req: Request
): Promise<{ body: T } | { response: NextResponse }> {
  const raw = await req.text();
  if (raw.length > MAX_BODY_CHARS) {
    return { response: NextResponse.json({ error: "Request too large" }, { status: 413 }) };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const key = user ? `user:${user.id}` : `ip:${ip}`;

  try {
    await limiter.check(user ? LIMIT_PER_HOUR_SIGNED_IN : LIMIT_PER_HOUR_SIGNED_OUT, key);
  } catch {
    const error = user
      ? "Too many AI requests. Please try again in a little while."
      : "Too many AI requests. Sign up for a free account to keep using AI suggestions.";
    return { response: NextResponse.json({ error }, { status: 429 }) };
  }

  try {
    return { body: JSON.parse(raw || "{}") as T };
  } catch {
    return { response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
}
