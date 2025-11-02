import mammoth from "mammoth";

export async function parseFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileType = file.type;

  try {
    if (fileType === "application/pdf") {
      return await parsePDF(buffer);
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      return await parseDOCX(buffer);
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse file: ${errorMessage}`);
  }
}

async function parsePDF(buffer: ArrayBuffer): Promise<string> {
  // Dynamic import for pdf-parse-fork (works in Next.js)
  const pdfParse = (await import("pdf-parse-fork")).default;
  const data = await pdfParse(Buffer.from(buffer));
  return data.text;
}

async function parseDOCX(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({
    arrayBuffer: buffer,
  });
  return result.value;
}

// Text cleaning ve normalization (Türkçe karakterleri korur)
export function cleanText(text: string): string {
  try {
    let cleaned = text;

    // Remove literal \uXXXX and \xXX escape sequences (problematic for PostgreSQL)
    cleaned = cleaned.replace(/\\u[0-9a-fA-F]{4}/g, '');
    cleaned = cleaned.replace(/\\x[0-9a-fA-F]{2}/g, '');

    // Remove null bytes and control characters (except newline, tab, carriage return)
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Remove invalid Unicode surrogates
    cleaned = cleaned.replace(/[\uD800-\uDFFF]/g, '');

    // Remove zero-width characters
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // Remove any remaining backslash-escaped characters
    cleaned = cleaned.replace(/\\[^\\nrt]/g, '');

    // Normalize Unicode to NFC form
    cleaned = cleaned.normalize('NFC');

    // Clean whitespace
    cleaned = cleaned
      .replace(/\s+/g, " ") // Çoklu boşlukları tek boşluğa indir
      .replace(/\n{3,}/g, "\n\n") // Çoklu satır atlamalarını azalt
      .trim();

    return cleaned;
  } catch (error) {
    console.warn('Text cleaning error:', error);
    // Fallback: aggressive ASCII-safe cleaning
    return text
      .replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Text validation
export function validateText(text: string): {
  isValid: boolean;
  error?: string;
} {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: "File contains no text" };
  }

  if (text.trim().length < 100) {
    return {
      isValid: false,
      error: "CV text is too short (minimum 100 characters)",
    };
  }

  if (text.trim().length > 50000) {
    return {
      isValid: false,
      error: "CV text is too long (maximum 50,000 characters)",
    };
  }

  return { isValid: true };
}
