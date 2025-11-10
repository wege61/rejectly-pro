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

    // Fetch cover letters with related job data
    const { data: coverLetters, error } = await supabase
      .from("cover_letters")
      .select(`
        *,
        job:documents!job_id(id, title, type)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cover letters:", error);
      return NextResponse.json(
        { error: "Failed to fetch cover letters" },
        { status: 500 }
      );
    }

    return NextResponse.json({ coverLetters });
  } catch (error) {
    console.error("Cover letters fetch error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to fetch cover letters: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    // Get cover letter ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Cover letter ID is required" },
        { status: 400 }
      );
    }

    // Delete cover letter
    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting cover letter:", error);
      return NextResponse.json(
        { error: "Failed to delete cover letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Cover letter deleted successfully",
    });
  } catch (error) {
    console.error("Cover letter deletion error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to delete cover letter: ${errorMessage}` },
      { status: 500 }
    );
  }
}
