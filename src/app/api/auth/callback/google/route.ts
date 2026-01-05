import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { config } from '@/lib/config';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/google';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('oauth_state')?.value;
  const storedNonce = cookieStore.get('oauth_nonce')?.value;
  const redirectTo = cookieStore.get('oauth_redirect')?.value || '/app';

  // Prepare response for cookie operations
  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  // Clear OAuth cookies
  response.cookies.delete('oauth_state');
  response.cookies.delete('oauth_nonce');
  response.cookies.delete('oauth_redirect');

  // Handle errors from Google
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Validate state for CSRF protection
  if (!state || state !== storedState) {
    console.error('State mismatch:', { state, storedState });
    return NextResponse.redirect(
      new URL('/login?error=invalid_state', request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', request.url)
    );
  }

  if (!storedNonce) {
    return NextResponse.redirect(
      new URL('/login?error=no_nonce', request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/login?error=token_exchange_failed', request.url)
      );
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Create Supabase server client with cookie handling for this response
    const supabase = createServerClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Sign in with Supabase using ID token
    const { data: authData, error: signInError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokens.id_token,
      nonce: storedNonce,
    });

    if (signInError) {
      console.error('Supabase signInWithIdToken error:', signInError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(signInError.message)}`, request.url)
      );
    }

    if (!authData.session) {
      console.error('No session returned from Supabase');
      return NextResponse.redirect(
        new URL('/login?error=no_session', request.url)
      );
    }

    // Return the response with all cookies set
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=callback_failed', request.url)
    );
  }
}
