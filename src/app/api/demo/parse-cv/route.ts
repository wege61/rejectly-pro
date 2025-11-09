import { NextRequest, NextResponse } from "next/server";
import { parseFile, cleanText, validateText } from "@/lib/parsers/fileParser";

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      success: true,
      text: cleanedText,
      fileName: file.name,
      textLength: cleanedText.length,
    });
  } catch (error) {
    console.error("CV parse error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to parse CV: ${errorMessage}` },
      { status: 500 }
    );
  }
}
