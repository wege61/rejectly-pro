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

    // Get request data
    const formData = await request.formData();
    const pdfFile = formData.get("pdf") as File;
    const reportId = formData.get("reportId") as string;

    if (!pdfFile || !reportId) {
      return NextResponse.json(
        { error: "PDF file and report ID required" },
        { status: 400 }
      );
    }

    // Verify report belongs to user
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("id, cv_id")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // Check if already saved
    const { data: existingCV } = await supabase
      .from("optimized_cvs")
      .select("id, file_url")
      .eq("report_id", reportId)
      .maybeSingle();

    if (existingCV) {
      return NextResponse.json({
        success: true,
        message: "PDF already saved",
        optimizedCV: existingCV,
      });
    }

    // Upload to Storage using Service Role (bypasses RLS)
    const timestamp = Date.now();
    const fileName = `${user.id}/${reportId}-optimized-${timestamp}.pdf`;

    const { createClient: createSupabaseClient } = await import(
      "@supabase/supabase-js"
    );
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("cv-files")
      .upload(fileName, pdfFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get CV title
    const { data: cvDoc } = await supabase
      .from("documents")
      .select("title")
      .eq("id", report.cv_id)
      .single();

    // Save to optimized_cvs table
    const { data: optimizedCV, error: dbError } = await supabase
      .from("optimized_cvs")
      .insert({
        user_id: user.id,
        report_id: reportId,
        original_cv_id: report.cv_id,
        title: `${cvDoc?.title || "CV"} - Optimized`,
        file_url: uploadData.path,
        text: "", // Will be populated from report.generated_cv if needed
        lang: "en",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PDF saved successfully",
      optimizedCV,
    });
  } catch (error) {
    console.error("Save optimized CV error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to save: ${errorMessage}` },
      { status: 500 }
    );
  }
}
