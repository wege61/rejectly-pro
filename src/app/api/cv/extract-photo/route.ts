import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { extractPhotoFromCV } from "@/lib/parsers/photoExtractor";

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

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    // Fetch document to get file URL
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      console.log("[extract-photo] Document not found:", documentId);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const fileUrl = document.file_url;
    // CV Builder entries have no uploaded file to read a photo from.
    if (!fileUrl || fileUrl.startsWith("builder://")) {
      console.log("[extract-photo] No file_url on document");
      return NextResponse.json({ found: false });
    }

    let downloadUrl = fileUrl;
    if (!fileUrl.startsWith('http')) {
      // Use service role to bypass RLS for generating signed URL in the backend
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: signData, error: signError } = await supabaseAdmin.storage.from('cv-files').createSignedUrl(fileUrl, 60);
      if (signError) {
        console.error("[extract-photo] Failed to sign URL for:", fileUrl, signError);
      }
      if (signData?.signedUrl) {
        downloadUrl = signData.signedUrl;
      } else {
        console.log("[extract-photo] Failed to sign URL for:", fileUrl);
        return NextResponse.json({ found: false });
      }
    }

    console.log("[extract-photo] Downloading CV file from:", downloadUrl.substring(0, 80) + "...");

    // Download the CV file (PDF or DOCX)
    let fileBytes: Buffer;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        console.log("[extract-photo] File fetch failed:", response.status);
        return NextResponse.json({ found: false });
      }
      fileBytes = Buffer.from(await response.arrayBuffer());
    } catch (e) {
      console.error("[extract-photo] File download error:", e);
      return NextResponse.json({ found: false });
    }

    try {
      const photo = await extractPhotoFromCV(fileBytes);
      if (photo) {
        console.log(`[extract-photo] Selected photo: ${photo.width}x${photo.height}`);
        return NextResponse.json({
          found: true,
          photoBase64: photo.dataUrl,
          width: photo.width,
          height: photo.height,
        });
      }
      console.log("[extract-photo] No suitable photo found.");
    } catch (scanErr) {
      console.error("[extract-photo] Photo extraction failed:", scanErr);
    }

    return NextResponse.json({ found: false });
  } catch (error) {
    console.error("[extract-photo] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to extract photo" },
      { status: 500 }
    );
  }
}

