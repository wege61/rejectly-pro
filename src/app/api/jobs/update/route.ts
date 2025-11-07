import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
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

    // Get request body
    const { jobId, title, url, description } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID required" },
        { status: 400 }
      );
    }

    if (!title || (!url && !description)) {
      return NextResponse.json(
        { error: "Title and either URL or description required" },
        { status: 400 }
      );
    }

    // For MVP, we'll just use the description text
    const jobText = description || `Job posting from: ${url}`;

    if (jobText.length < 50) {
      return NextResponse.json(
        { error: "Job description too short (minimum 50 characters)" },
        { status: 400 }
      );
    }

    // Update job in database
    const { data: job, error: dbError } = await supabase
      .from("documents")
      .update({
        title: title,
        text: jobText,
        file_url: url || null,
      })
      .eq("id", jobId)
      .eq("user_id", user.id) // Ensure user owns this job
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        title: job.title,
        textLength: jobText.length,
        updatedAt: job.updated_at,
      },
    });
  } catch (error) {
    console.error("Job update error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to update job: ${errorMessage}` },
      { status: 500 }
    );
  }
}
