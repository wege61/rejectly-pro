import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyTurnstileToken } from "@/lib/validations";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  turnstileToken: z.string().nullish(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    // Rate limiting: max 10 requests per 15 minutes per IP
    try {
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      await limiter.check(10, `signup_${ip}`);
    } catch {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    const { email, password, name, turnstileToken } = result.data;

    // Verify CAPTCHA if configured
    if (process.env.TURNSTILE_SECRET_KEY) {
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

    // Create user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 400 }
      );
    }

    const finalResponse = NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });

    // Transfer cookies from the response object used by createServerClient
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie);
    });

    return finalResponse;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup. Please try again." },
      { status: 500 }
    );
  }
}
