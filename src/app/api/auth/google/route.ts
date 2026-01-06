import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/google';

// Generate a random string for state/nonce
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Hash nonce using SHA-256 for Google OAuth
async function hashNonce(nonce: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function GET(request: NextRequest) {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    // Generate state for CSRF protection
    const state = generateRandomString(32);

    // Generate nonce for ID token verification
    const nonce = generateRandomString(32);

    // Hash nonce for Google (Google stores it as-is, Supabase will hash our raw nonce to compare)
    const hashedNonce = await hashNonce(nonce);

    // Get redirect path from query params (default to dashboard)
    const searchParams = request.nextUrl.searchParams;
    const redirectTo = searchParams.get('redirect') || '/app';

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    };

    // Store state, nonce, and redirect in cookies
    const cookieStore = await cookies();

    cookieStore.set('oauth_state', state, cookieOptions);
    cookieStore.set('oauth_nonce', nonce, cookieOptions); // Store raw nonce, Supabase will hash it
    cookieStore.set('oauth_redirect', redirectTo, cookieOptions);

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('nonce', hashedNonce); // Send hashed nonce to Google
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    // Redirect to Google
    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}
