import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyTurnstileToken } from "@/lib/validations";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  turnstileToken: z.string().nullish(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    // Rate limiting: max 10 requests per 15 minutes per IP
    try {
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      await limiter.check(10, `login_${ip}`);
    } catch {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    const { email, password, turnstileToken } = result.data;

    // Verify CAPTCHA if configured
    if (process.env.TURNSTILE_SECRET_KEY && process.env.NODE_ENV !== 'development') {
      if (!turnstileToken) {
        return NextResponse.json(
          { error: "CAPTCHA verification required" },
          { status: 400 }
        );
      }

      const isValidCaptcha = await verifyTurnstileToken(turnstileToken);
      if (!isValidCaptcha) {
        return NextResponse.json(
          { error: "CAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // Create response to set cookies on
    const response = NextResponse.json({ success: true });
    const cookieStore = await cookies();

    // Create Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return the response with cookies set
    const finalResponse = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

    // Transfer cookies from the response object used by createServerClient
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie);
    });

    return finalResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
