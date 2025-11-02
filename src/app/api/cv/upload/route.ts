import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFile, cleanText, validateText } from "@/lib/parsers/fileParser";

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

    // Upload file using Service Role (bypasses RLS)
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(file.name); // ← BURASI DEĞİŞTİ
    const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`; // ← BURASI DEĞİŞTİ

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
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const filePath = uploadData.path;

    // Save document metadata to database
    // Sanitize title to prevent Unicode escape sequence errors
    const sanitizedTitle = cleanText(file.name);

    const { data: document, error: dbError } = await supabase
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