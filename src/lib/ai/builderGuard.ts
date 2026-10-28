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
 *
 * Every field is also trimmed to what a resume needs, so a pasted wall of text
 * can't be used as a prompt, and a site-wide daily budget caps the total spend
 * even if requests come from many addresses. Each route caps its own output
 * with `max_completion_tokens` (BUILDER_OUTPUT_TOKENS).
 */

const MAX_BODY_CHARS = 20_000;
const MAX_FIELD_CHARS = 600; // a long resume bullet is ~300
const MAX_LIST_ITEMS = 20;
const LIMIT_PER_HOUR_SIGNED_OUT = 15;
const LIMIT_PER_HOUR_SIGNED_IN = 150;
const DAILY_LIMIT = Number(process.env.BUILDER_AI_DAILY_LIMIT) || 5000;

export const BUILDER_OUTPUT_TOKENS = { polish: 600, bullets: 900, skills: 900, summary: 1500 } as const;

const limiter = rateLimit({ name: "builder-ai", interval: 60 * 60 * 1000, uniqueTokenPerInterval: 2000 });
const dailyBudget = rateLimit({ name: "builder-ai-daily", interval: 24 * 60 * 60 * 1000, uniqueTokenPerInterval: 1 });

/** Trim strings and lists to resume-sized pieces. */
function trimBody(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return value.slice(0, MAX_FIELD_CHARS);
  if (depth > 4) return undefined;
  if (Array.isArray(value)) return value.slice(0, MAX_LIST_ITEMS).map((v) => trimBody(v, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, trimBody(v, depth + 1)]));
  }
  return value;
}

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
    await dailyBudget.check(DAILY_LIMIT, "all");
  } catch {
    return {
      response: NextResponse.json({ error: "AI suggestions are busy right now. Please try again later." }, { status: 429 }),
    };
  }

  try {
    return { body: trimBody(JSON.parse(raw || "{}")) as T };
  } catch {
    return { response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
}
