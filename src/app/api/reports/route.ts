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

    // Fetch reports with related CV data
    // Note: job_ids is a JSONB array, so we can't join it directly
    const { data: reports, error } = await supabase
      .from("reports")
      .select(`
        *,
        cv:documents!cv_id(id, title, type)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      return NextResponse.json(
        { error: "Failed to fetch reports" },
        { status: 500 }
      );
    }

    // Fetch job documents for each report (job_ids is a JSONB array)
    const reportsWithJobs = await Promise.all(
      (reports || []).map(async (report) => {
        const jobIds = Array.isArray(report.job_ids) ? report.job_ids : [];

        if (jobIds.length > 0) {
          // Fetch the first job from the job_ids array
          const { data: jobData } = await supabase
            .from("documents")
            .select("id, title, type")
            .eq("id", jobIds[0])
            .single();

          return {
            ...report,
            is_premium: report.pro, // Map 'pro' to 'is_premium' for frontend compatibility
            job: jobData,
          };
        }

        return {
          ...report,
          is_premium: report.pro,
          job: null,
        };
      })
    );

    return NextResponse.json({ reports: reportsWithJobs });
  } catch (error) {
    console.error("Reports fetch error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to fetch reports: ${errorMessage}` },
      { status: 500 }
    );
  }
}
