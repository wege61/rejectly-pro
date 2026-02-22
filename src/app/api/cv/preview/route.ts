import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    // Lookup document to get its file_url
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("file_url")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document || !document.file_url) {
      return NextResponse.json({ error: "Document or file URL not found" }, { status: 404 });
    }

    // Generate signed URL via Admin Service Role to bypass Row Level Security
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin.storage
      .from("cv-files")
      .createSignedUrl(document.file_url, 3600); // 1 hour validity

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: "Failed to generate preview URL" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });

  } catch (error) {
    console.error("[preview-route] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
