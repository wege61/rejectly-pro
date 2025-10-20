import { NextRequest, NextResponse } from "next/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateFreeSummaryPrompt } from "@/lib/ai/prompts";
import { parseFile, cleanText, validateText } from "@/lib/parsers/fileParser";

// Rate limiting için basit in-memory cache
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  // 1 saat içinde max 5 request (artırdık)
  if (record) {
    if (now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + 3600000 });
      return true;
    }
    if (record.count >= 5) {
      return false;
    }
    record.count++;
    return true;
  }

  requestCounts.set(ip, { count: 1, resetTime: now + 3600000 });
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Try again in 1 hour or sign up for unlimited analyses.",
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const cvText = formData.get("cvText") as string | null;
    const jobText = formData.get("jobText") as string;

    let finalCvText = "";

    // File upload veya text
    if (file) {
      // File validation
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only PDF and DOCX allowed." },
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit" },
          { status: 400 }
        );
      }

      // Parse file
      const rawText = await parseFile(file);
      finalCvText = cleanText(rawText);

      // Validate
      const validation = validateText(finalCvText);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    } else if (cvText) {
      finalCvText = cleanText(cvText);

      if (finalCvText.length < 100) {
        return NextResponse.json(
          { error: "CV text too short (minimum 100 characters)" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Please provide either a CV file or text" },
        { status: 400 }
      );
    }

    if (!jobText || jobText.length < 50) {
      return NextResponse.json(
        { error: "Job description too short (minimum 50 characters)" },
        { status: 400 }
      );
    }

    // Limit text length for demo
    const limitedCvText = finalCvText.slice(0, 5000);
    const limitedJobText = jobText.slice(0, 3000);

    // Generate AI analysis
    const prompt = generateFreeSummaryPrompt(limitedCvText, [limitedJobText]);

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      success: true,
      fitScore: result.fitScore || 0,
      summary: result.summary || "",
      missingKeywords: result.missingKeywords || [],
    });
  } catch (error) {
    console.error("Demo analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Analysis failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
