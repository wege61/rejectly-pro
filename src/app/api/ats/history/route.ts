import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get limit from query params (default 5)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    // Fetch optimized CVs from ats-optimizer source
    const { data: optimizedCVs, error: fetchError } = await supabase
      .from("optimized_cvs")
      .select("id, title, contact_name, file_url, before_score, after_score, ats_result, changes, created_at")
      .eq("user_id", user.id)
      .eq("source", "ats-optimizer")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (fetchError) {
      console.error("Failed to fetch optimized CVs:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch history" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      optimizedCVs: optimizedCVs || [],
    });
  } catch (error) {
    console.error("ATS history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
