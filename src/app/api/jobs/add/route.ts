import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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
    const { title, url, description } = await request.json();

    if (!title || (!url && !description)) {
      return NextResponse.json(
        { error: "Title and either URL or description required" },
        { status: 400 }
      );
    }

    // For MVP, we'll just use the description text
    // In production, you'd scrape the URL to get job description
    const jobText = description || `Job posting from: ${url}`;

    if (jobText.length < 50) {
      return NextResponse.json(
        { error: "Job description too short (minimum 50 characters)" },
        { status: 400 }
      );
    }

    // Save job to database
    const { data: job, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        type: "job",
        title: title,
        text: jobText,
        file_url: url || null,
        lang: "en",
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        title: job.title,
        textLength: jobText.length,
        createdAt: job.created_at,
      },
    });
  } catch (error) {
    console.error("Job add error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to add job: ${errorMessage}` },
      { status: 500 }
    );
  }
}
