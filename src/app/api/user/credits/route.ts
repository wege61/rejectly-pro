import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserAccessStatus } from "@/lib/credits";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessStatus = await getUserAccessStatus(user.id);

    return NextResponse.json({
      credits: accessStatus.credits,
      hasSubscription: accessStatus.hasSubscription,
      subscriptionStatus: accessStatus.subscriptionStatus,
      canAnalyze: accessStatus.canAnalyze,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
