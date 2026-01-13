import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { validateCVContent } from '@/lib/ai/cvValidator';

// Sanitize text to remove problematic Unicode escape sequences
function sanitizeText(text: string): string {
  try {
    let cleaned = text;

    // Remove literal \uXXXX escape sequences
    cleaned = cleaned.replace(/\\u[0-9a-fA-F]{4}/g, '');
    cleaned = cleaned.replace(/\\x[0-9a-fA-F]{2}/g, '');

    // Remove null bytes and control characters
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Replace invalid Unicode surrogates
    cleaned = cleaned.replace(/[\uD800-\uDFFF]/g, '');

    // Remove zero-width characters
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // Normalize Unicode
    cleaned = cleaned.normalize('NFC');

    // Clean whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\\[^\\]/g, '');

    return cleaned.trim();
  } catch (error) {
    return text
      .replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

async function parsePDF(buffer: Buffer): Promise<string> {
  // Dynamic import for pdf-parse-fork (works in Node.js server environment)
  const pdfParse = (await import("pdf-parse-fork")).default;
  const data = await pdfParse(buffer);

  if (!data.text || data.text.trim().length === 0) {
    throw new Error('No text content found in PDF. The PDF might be image-based or scanned.');
  }

  return sanitizeText(data.text);
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });

  if (!result || !result.value) {
    throw new Error('No text content found in DOCX');
  }

  return sanitizeText(result.value);
}

// Public endpoint - no authentication required
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and DOCX files are allowed' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text: string;

    if (file.type === 'application/pdf') {
      text = await parsePDF(buffer);
    } else {
      text = await parseDOCX(buffer);
    }

    // Validate extracted text
    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: `Document appears to be empty or too short. Minimum 100 characters required.` },
        { status: 400 }
      );
    }

    // CV content validation - block irrelevant files
    const cvValidation = await validateCVContent(text);
    if (!cvValidation.isCV) {
      console.log('❌ CV validation failed (ats/parse):', {
        fileName: file.name,
        detectedType: cvValidation.detectedType,
        confidence: cvValidation.confidence,
      });
      return NextResponse.json(
        {
          error: cvValidation.reason,
          code: 'NOT_A_CV',
          detectedType: cvValidation.detectedType,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: text,
      fileName: file.name,
      charCount: text.length,
    });

  } catch (error: any) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse document' },
      { status: 500 }
    );
  }
}
