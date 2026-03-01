/**
 * Simple in-memory rate limiter for Next.js API routes
 * For production, consider using @upstash/ratelimit with Redis
 *
 * Usage:
 * const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });
 * const { success } = await limiter.check(request, 10, 'CACHE_KEY');
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max unique tokens to track
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const tokenCache = new Map<
  string,
  { count: number; expiresAt: number }
>();

// Cleanup expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tokenCache.entries()) {
    if (value.expiresAt < now) {
      tokenCache.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (
      request: Request,
      limit: number,
      cacheKey: string
    ): Promise<RateLimitResult> => {
      // Get identifier (IP address or user ID)
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0] ?? "anonymous";

      const key = `${cacheKey}_${ip}`;
      const now = Date.now();

      // Get or create token
      let token = tokenCache.get(key);

      if (!token || token.expiresAt < now) {
        // Create new token
        token = {
          count: 0,
          expiresAt: now + config.interval,
        };
      }

      token.count++;
      tokenCache.set(key, token);

      // Enforce max tracked tokens
      if (tokenCache.size > config.uniqueTokenPerInterval) {
        // Remove oldest tokens
        const entries = Array.from(tokenCache.entries());
        entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt);
        for (let i = 0; i < entries.length - config.uniqueTokenPerInterval; i++) {
          tokenCache.delete(entries[i][0]);
        }
      }

      const remaining = Math.max(0, limit - token.count);
      const success = token.count <= limit;

      return {
        success,
        limit,
        remaining,
        reset: token.expiresAt,
      };
    },
  };
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  // Auth endpoints: 5 requests per minute
  auth: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
  }),

  // API endpoints: 30 requests per minute
  api: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
  }),

  // AI endpoints: 10 requests per minute (expensive)
  ai: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
  }),

  // File uploads: 5 per minute
  upload: rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
  }),
};

/**
 * Helper to create rate limit headers
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}

/**
 * Helper to return rate limit exceeded response
 */
export function rateLimitExceeded(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...rateLimitHeaders(result),
        "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  );
}

/**
 * Example usage in an API route:
 *
 * import { rateLimiters, rateLimitExceeded, rateLimitHeaders } from '@/lib/rateLimit';
 *
 * export async function POST(request: Request) {
 *   const { success, ...rateLimit } = await rateLimiters.auth.check(request, 5, 'login');
 *
 *   if (!success) {
 *     return rateLimitExceeded(rateLimit);
 *   }
 *
 *   // Process request...
 *   return Response.json({ data }, { headers: rateLimitHeaders(rateLimit) });
 * }
 */
