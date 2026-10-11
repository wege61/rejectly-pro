import { LRUCache } from 'lru-cache';
import { createClient } from '@supabase/supabase-js';

type RateLimitOptions = {
  /** Namespaces the counters so different limiters never share a key. */
  name: string;
  uniqueTokenPerInterval?: number;
  interval?: number;
};

/**
 * Fixed-window rate limiter. Counts are shared across server instances through
 * the `rate_limit_hit` database function (migration 025). If the database can't
 * be reached, or the migration isn't applied yet, it falls back to per-instance
 * memory so requests are still limited.
 */
export default function rateLimit(options: RateLimitOptions) {
  const interval = options.interval || 60000;
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: interval,
  });

  const countInMemory = (key: string) => {
    const tokenCount = tokenCache.get(key) || [0];
    if (tokenCount[0] === 0) tokenCache.set(key, tokenCount);
    tokenCount[0] += 1;
    return tokenCount[0];
  };

  return {
    /** Resolves if `token` has made at most `limit` requests this interval; rejects otherwise. */
    check: async (limit: number, token: string): Promise<void> => {
      const key = `${options.name}:${token}`;
      const count = (await countInDatabase(key, interval)) ?? countInMemory(key);
      if (count > limit) {
        throw new Error(`Rate limit exceeded. Maximum allowed: ${limit} per interval.`);
      }
    },
  };
}

let databaseUnavailable = false;

async function countInDatabase(key: string, intervalMs: number): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (databaseUnavailable || !url || !serviceKey) return null;

  try {
    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.rpc('rate_limit_hit', {
      p_key: key,
      p_window_seconds: Math.max(1, Math.round(intervalMs / 1000)),
    });
    if (error) {
      // PGRST202: the function doesn't exist yet (migration 025 not applied).
      if (error.code === 'PGRST202') databaseUnavailable = true;
      console.warn('[rate-limit] Falling back to in-memory limits:', error.message);
      return null;
    }
    return typeof data === 'number' ? data : null;
  } catch (err) {
    console.warn('[rate-limit] Falling back to in-memory limits:', err);
    return null;
  }
}
