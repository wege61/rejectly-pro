import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Rate Limiting Configuration
 * In-memory rate limiter for Next.js middleware
 * For production, consider using @upstash/ratelimit with Redis
 */

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations per route pattern
const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/auth": { limit: 5, windowMs: 60 * 1000 }, // 5 req/min
  "/api/analyze": { limit: 10, windowMs: 60 * 1000 }, // 10 req/min
  "/api/cv/upload": { limit: 5, windowMs: 60 * 1000 }, // 5 req/min
  "/api/ats": { limit: 20, windowMs: 60 * 1000 }, // 20 req/min
  "/api/cover-letter": { limit: 10, windowMs: 60 * 1000 }, // 10 req/min
  "/api/stripe": { limit: 10, windowMs: 60 * 1000 }, // 10 req/min
  "/api": { limit: 60, windowMs: 60 * 1000 }, // Default: 60 req/min
};

// Giriş gerektiren sayfalar
const PROTECTED_ROUTES = [
  '/dashboard',
  '/reports',
  '/cv',
  '/ats-optimizer',
  '/jobs',
  '/analyze',
  '/cover-letters',
  '/billing',
  '/settings',
];

// Giriş yapmış kullanıcının görmemesi gereken sayfalar
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.expiresAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 60 * 1000);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return "anonymous";
}

function getRateLimitConfig(pathname: string): { limit: number; windowMs: number } {
  // Match the most specific rate limit config
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(pattern) && pattern !== "/api") {
      return config;
    }
  }

  // Default API rate limit
  if (pathname.startsWith("/api")) {
    return RATE_LIMITS["/api"];
  }

  // No rate limit for non-API routes
  return { limit: Infinity, windowMs: 0 };
}

function checkRateLimit(
  ip: string,
  pathname: string,
  config: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number; reset: number } {
  const key = `${ip}:${pathname.split("/").slice(0, 3).join("/")}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  if (!entry || entry.expiresAt < now) {
    entry = {
      count: 0,
      expiresAt: now + config.windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, config.limit - entry.count);
  const allowed = entry.count <= config.limit;

  return {
    allowed,
    remaining,
    reset: entry.expiresAt,
  };
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============ Rate Limiting for API routes ============
  if (pathname.startsWith("/api")) {
    const ip = getClientIp(request);
    const config = getRateLimitConfig(pathname);

    if (config.limit !== Infinity) {
      const { allowed, remaining, reset } = checkRateLimit(ip, pathname, config);

      if (!allowed) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);

        return new NextResponse(
          JSON.stringify({
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
            retryAfter,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": config.limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": reset.toString(),
              "Retry-After": retryAfter.toString(),
            },
          }
        );
      }

      // Add rate limit headers to API responses
      const response = NextResponse.next({
        request: { headers: request.headers },
      });
      response.headers.set("X-RateLimit-Limit", config.limit.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", reset.toString());
      return response;
    }

    return NextResponse.next();
  }

  // ============ Auth middleware for page routes ============
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request for subsequent middleware/route usage
          request.cookies.set({
            name,
            value,
            ...options,
          });

          // Update response to send to browser
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });

          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Korumalı sayfalara giriş yapmamış kullanıcı erişmeye çalışırsa
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth sayfalarına giriş yapmış kullanıcı erişmeye çalışırsa
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route);

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
