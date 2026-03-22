import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifyTurnstileToken } from "@/lib/validations";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  turnstileToken: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { email, turnstileToken } = result.data;

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

    // Get origin from request headers
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "";
    const cookieStore = await cookies();

    // Create Supabase client (read-only cookies for this operation)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    // Always return success to prevent email enumeration
    if (error) {
      console.error("Password reset error:", error);
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
