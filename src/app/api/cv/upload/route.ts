import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFile, cleanText, validateText } from "@/lib/parsers/fileParser";
import { validateCVContent } from "@/lib/ai/cvValidator";

// En üste, import'lardan hemen sonra bu fonksiyonu ekle:
function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFD') // Unicode karakterleri ayır
    .replace(/[\u0300-\u036f]/g, '') // Aksanları kaldır
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[şŞ]/g, 's')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Diğer özel karakterleri _ yap
    .replace(/_+/g, '_') // Birden fazla _ varsa tek yap
    .replace(/^_|_$/g, ''); // Baştaki ve sondaki _ 'leri kaldır
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // DEBUG: Log user info
    console.log("🔍 Auth Debug:", {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message,
    });

    if (authError || !user) {
      console.error("❌ Auth failed:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Parse file to extract text
    const rawText = await parseFile(file);
    const cleanedText = cleanText(rawText);

    // Validate extracted text
    const validation = validateText(cleanedText);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // CV content validation - block irrelevant files
    const cvValidation = await validateCVContent(cleanedText);
    if (!cvValidation.isCV) {
      console.log("❌ CV validation failed:", {
        userId: user.id,
        fileName: file.name,
        detectedType: cvValidation.detectedType,
        confidence: cvValidation.confidence,
        reason: cvValidation.reason,
      });
      return NextResponse.json(
        {
          error: cvValidation.reason,
          code: "NOT_A_CV",
          detectedType: cvValidation.detectedType,
        },
        { status: 400 }
      );
    }

    console.log("✅ CV validation passed:", {
      userId: user.id,
      fileName: file.name,
      confidence: cvValidation.confidence,
    });

    // Check if user already has a CV with the same filename
    const sanitizedTitle = cleanText(file.name);
    const { data: existingCV } = await supabase
      .from("documents")
      .select("id, title, file_url, created_at")
      .eq("user_id", user.id)
      .eq("type", "cv")
      .eq("title", sanitizedTitle)
      .single();

    // Setup Supabase Admin for storage operations
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

    // Upload file using Service Role (bypasses RLS)
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("cv-files")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const filePath = uploadData.path;

    let document;

    if (existingCV) {
      // Update existing CV - overwrite with new content
      console.log("ℹ️ Updating existing CV with same name:", {
        userId: user.id,
        fileName: file.name,
        existingDocId: existingCV.id,
      });

      // Delete old file from storage if exists
      if (existingCV.file_url) {
        await supabaseAdmin.storage
          .from("cv-files")
          .remove([existingCV.file_url]);
      }

      // Update document in database
      const { data: updatedDoc, error: updateError } = await supabase
        .from("documents")
        .update({
          text: cleanedText,
          file_url: filePath,
          updated_at: new Date().toISOString(),
          ats_score: null,
          ats_breakdown: null,
          ats_checked_at: null,
        })
        .eq("id", existingCV.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Database error: ${updateError.message}`);
      }

      document = updatedDoc;
      console.log("✅ CV updated:", {
        documentId: document.id,
        userId: user.id,
        type: "cv"
      });
    } else {
      // Create new CV
      const { data: newDoc, error: dbError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          type: "cv",
          title: sanitizedTitle,
          text: cleanedText,
          file_url: filePath,
          lang: "tr",
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      document = newDoc;
      console.log("✅ CV uploaded:", {
        documentId: document.id,
        userId: user.id,
        type: "cv"
      });
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        textLength: cleanedText.length,
        createdAt: document.created_at,
      },
    });
  } catch (error) {
    console.error("CV upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to upload CV: ${errorMessage}` },
      { status: 500 }
    );
  }
}