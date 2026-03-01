import { z } from "zod";

/**
 * Zod validation schemas for API request bodies
 * Provides runtime type safety and input sanitization
 */

// ============================================
// Free Analysis API
// ============================================
export const analyzeRequestSchema = z.object({
  cvId: z.string().uuid("Invalid CV ID format"),
  jobIds: z
    .array(z.string().uuid("Invalid job ID format"))
    .min(1, "At least one job ID is required")
    .max(3, "Maximum 3 job postings allowed for free analysis"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

// ============================================
// Pro Analysis API
// ============================================
export const proAnalyzeRequestSchema = z.object({
  reportId: z.string().uuid("Invalid report ID format"),
});

export type ProAnalyzeRequest = z.infer<typeof proAnalyzeRequestSchema>;

// ============================================
// Stripe Checkout API
// ============================================
export const checkoutRequestSchema = z.object({
  priceId: z
    .string()
    .min(1, "Price ID is required")
    .refine(
      (val) => val.startsWith("price_") && !val.includes("..."),
      "Invalid Stripe Price ID format"
    ),
  successUrl: z.string().url("Invalid success URL"),
  cancelUrl: z.string().url("Invalid cancel URL"),
  mode: z.enum(["subscription", "payment"]).default("subscription"),
  quantity: z.number().int().positive().default(1),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

// ============================================
// ATS Check API
// ============================================
export const atsCheckRequestSchema = z.object({
  documentId: z.string().uuid("Invalid document ID format").optional(),
  reportId: z.string().uuid("Invalid report ID format").optional(),
  cvText: z.string().max(100000, "CV text too long").optional(),
  unlock: z.boolean().default(false),
  useAI: z.boolean().default(false),
}).refine(
  (data) => data.documentId || data.reportId || data.cvText,
  "Either documentId, reportId, or cvText is required"
);

export type ATSCheckRequest = z.infer<typeof atsCheckRequestSchema>;

// ============================================
// Cover Letter Generation API
// ============================================
export const coverLetterRequestSchema = z.object({
  reportId: z.string().uuid("Invalid report ID format"),
  existingLetterId: z.string().uuid("Invalid letter ID format").optional(),
  tone: z.enum(["professional", "friendly", "formal"]).default("professional"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  language: z.enum(["en", "tr"]).default("en"),
  template: z
    .enum([
      "standard",
      "story_driven",
      "technical_focus",
      "results_oriented",
      "career_change",
      "short_intro",
    ])
    .default("standard"),
  customizationFields: z
    .object({
      companySpecific: z.string().max(500).optional(),
      personalNote: z.string().max(500).optional(),
      achievements: z.array(z.string().max(200)).max(5).optional(),
    })
    .optional(),
});

export type CoverLetterRequest = z.infer<typeof coverLetterRequestSchema>;

// ============================================
// CV Upload Validation
// ============================================
export const cvUploadSchema = z.object({
  file: z.any().refine(
    (file) => {
      if (!file) return false;
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(file.type);
    },
    "Only PDF and DOCX files are allowed"
  ),
});

// ============================================
// Job Add API
// ============================================
export const addJobRequestSchema = z.object({
  title: z.string().min(1, "Job title is required").max(200, "Title too long"),
  text: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(50000, "Job description too long"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  company: z.string().max(200, "Company name too long").optional(),
});

export type AddJobRequest = z.infer<typeof addJobRequestSchema>;

// ============================================
// Turnstile CAPTCHA Verification
// ============================================
export const turnstileSchema = z.object({
  token: z.string().min(1, "CAPTCHA token is required"),
});

export type TurnstileVerification = z.infer<typeof turnstileSchema>;

// ============================================
// Helper function to validate and parse requests
// ============================================
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.errors[0];
    return {
      success: false,
      error: firstError?.message || "Validation failed",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

// ============================================
// Turnstile Server-Side Verification
// ============================================
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not configured, skipping verification");
    return true; // Skip verification if not configured
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
