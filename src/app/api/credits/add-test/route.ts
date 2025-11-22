import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addCredits } from "@/lib/credits";

// TEST ONLY - Remove in production
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { credits, planName } = await request.json();

    if (!credits || credits <= 0) {
      return NextResponse.json({ error: "Invalid credits" }, { status: 400 });
    }

    const success = await addCredits(user.id, credits);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to add credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Added ${credits} credits (${planName})`,
      credits,
    });
  } catch (error) {
    console.error("Error adding test credits:", error);
    return NextResponse.json(
      { error: "Failed to add credits" },
      { status: 500 }
    );
  }
}
