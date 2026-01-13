import { openai, AI_MODEL } from "./client";

export interface CVValidationResult {
  isCV: boolean;
  confidence: number; // 0-100
  reason: string;
  detectedType?: string; // e.g., "invoice", "book", "article", "cv"
}

/**
 * AI-based CV validation function
 * Checks if the uploaded file is actually a CV/resume
 */
export async function validateCVContent(
  text: string
): Promise<CVValidationResult> {
  // Cost optimization: only analyze first 1500 characters
  const sampleText = text.slice(0, 1500);

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      temperature: 0,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You are a CV/resume validation expert. Determine if the given text is a CV/resume.

CVs typically contain:
- Personal information (name, contact)
- Work experience
- Education
- Skills/abilities
- Languages

Documents that are NOT CVs:
- Invoices, receipts
- Books, articles
- Reports, presentations
- Contracts
- Random text
- News, blog posts

Respond in JSON format:
{
  "isCV": true/false,
  "confidence": 0-100,
  "reason": "Brief explanation in English",
  "detectedType": "cv/invoice/book/article/contract/other"
}`,
        },
        {
          role: "user",
          content: `Is this text a CV/resume? Analyze:\n\n${sampleText}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty AI response");
    }

    // Parse JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON format not found");
    }

    const result = JSON.parse(jsonMatch[0]) as CVValidationResult;

    // Security check: reject if confidence is too low
    if (result.isCV && result.confidence < 60) {
      result.isCV = false;
      result.reason =
        "We couldn't confirm this document is a CV. Please upload a valid resume.";
    }

    return result;
  } catch (error) {
    console.error("CV validation error:", error);

    // Fallback: simple keyword check
    return fallbackValidation(text);
  }
}

/**
 * Fallback: Simple keyword check when AI fails
 */
function fallbackValidation(text: string): CVValidationResult {
  const lowerText = text.toLowerCase();

  // Keywords expected in a CV (Turkish + English)
  const cvKeywords = [
    // Turkish
    "deneyim",
    "tecrübe",
    "eğitim",
    "üniversite",
    "lisans",
    "yüksek lisans",
    "beceri",
    "yetenek",
    "iş deneyimi",
    "staj",
    "sertifika",
    "referans",
    "özgeçmiş",
    "cv",
    "kişisel bilgiler",
    "doğum tarihi",
    "mezuniyet",
    // English
    "experience",
    "education",
    "skills",
    "university",
    "bachelor",
    "master",
    "work experience",
    "internship",
    "certificate",
    "resume",
    "curriculum vitae",
  ];

  // Keywords that indicate non-CV documents (higher weight)
  const nonCVKeywords = [
    "fatura",
    "invoice",
    "toplam tutar",
    "kdv",
    "ödeme",
    "sipariş",
    "order",
    "chapter",
    "bölüm",
    "sayfa",
    "page",
    "isbn",
    "yayınevi",
    "publisher",
    "abstract",
    "özet",
    "kaynakça",
    "giriş",
    "sonuç",
    "madde",
    "sözleşme",
    "taraflar",
    "contract",
    "total amount",
    "payment",
    "receipt",
  ];

  let cvScore = 0;
  let nonCVScore = 0;

  // Count CV keywords
  for (const keyword of cvKeywords) {
    if (lowerText.includes(keyword)) {
      cvScore++;
    }
  }

  // Count non-CV keywords (higher weight)
  for (const keyword of nonCVKeywords) {
    if (lowerText.includes(keyword)) {
      nonCVScore += 2;
    }
  }

  const isCV = cvScore >= 3 && cvScore > nonCVScore;
  const confidence = Math.min(
    100,
    Math.max(0, (cvScore - nonCVScore) * 10 + 50)
  );

  if (isCV) {
    return {
      isCV: true,
      confidence,
      reason: "Document appears to match CV format.",
      detectedType: "cv",
    };
  } else if (nonCVScore > cvScore) {
    return {
      isCV: false,
      confidence: Math.min(100, nonCVScore * 15),
      reason:
        "This document does not appear to be a CV. Please upload your resume.",
      detectedType: "other",
    };
  } else {
    return {
      isCV: false,
      confidence: 60,
      reason:
        "Not enough CV content found in this document. Please upload a resume with work experience, education, and skills.",
      detectedType: "other",
    };
  }
}
