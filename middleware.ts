import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // www → non-www redirect (canonical URL)
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const newUrl = request.nextUrl.clone();
    newUrl.host = host.replace(/^www\./, '');
    return NextResponse.redirect(newUrl, { status: 301 });
  }

  // ============ Auth middleware for page routes ============
  const response = NextResponse.next({
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

  // Korumalı sayfalara giriş yapmamış kullanıcı erişmeye çalışırsa
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Auth sayfalarına giriş yapmış kullanıcı erişmeye çalışırsa
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route);

  // Sadece yetki gerektiren sayfalarda Supabase sorgusu yap (Performans Optimizasyonu)
  if (isProtectedRoute || isAuthRoute) {
    const { data: { user } } = await supabase.auth.getUser();

    if (isProtectedRoute && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
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
