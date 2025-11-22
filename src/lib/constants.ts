// Pricing
export const PRICING = {
  SINGLE: {
    id: "single",
    name: "Single",
    price: 2, // USD
    priceInCents: 200,
    credits: 1,
    type: "one-time" as const,
    description: "Try it out",
    features: [
      "1 Pro analysis",
      "Detailed match insights",
      "All missing keywords",
      "3 bullet points rewritten",
      "ATS optimization guide",
      "3 role recommendations",
      "AI-optimized resume",
      "PDF download",
    ],
  },
  STARTER: {
    id: "starter",
    name: "Starter",
    price: 7, // USD
    priceInCents: 700,
    credits: 10,
    type: "one-time" as const,
    description: "Best value",
    popular: true,
    features: [
      "10 Pro analyses",
      "Detailed match insights",
      "All missing keywords",
      "3 bullet points rewritten",
      "ATS optimization guide",
      "3 role recommendations",
      "AI-optimized resume",
      "PDF download",
    ],
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 12, // USD
    priceInCents: 1200,
    credits: -1, // unlimited
    type: "subscription" as const,
    description: "Unlimited access",
    features: [
      "Unlimited Pro analyses",
      "Detailed match insights",
      "All missing keywords",
      "3 bullet points rewritten",
      "ATS optimization guide",
      "3 role recommendations",
      "AI-optimized resume",
      "PDF download",
      "Priority support",
    ],
  },
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  CV: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [".pdf", ".docx", ".doc"],
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ],
  },
} as const;

// Analysis Limits
export const ANALYSIS_LIMITS = {
  FREE_USER: {
    maxJobsPerAnalysis: 3,
    maxAnalysesPerMonth: 3, // Free tier
  },
  CREDIT_USER: {
    maxJobsPerAnalysis: 10,
    // Uses credits per analysis
  },
  PRO_USER: {
    maxJobsPerAnalysis: 10,
    maxAnalysesPerMonth: -1, // unlimited with subscription
  },
} as const;

// AI Model Configuration
export const AI_CONFIG = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 2000,
  freeSummaryMaxLength: 450,
  freeSummaryMinLength: 350,
} as const;

// Routes
export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    FEATURES: "/features",
    HOW_IT_WORKS: "/how-it-works",
    PRICING: "/pricing",
    FAQ: "/faq",
    PRIVACY: "/privacy",
    TERMS: "/terms",
    ABOUT: "/about",
    CONTACT: "/contact",
  },
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    RESET_PASSWORD: "/reset-password",
    FORGOT_PASSWORD: "/forgot-password",
  },
  APP: {
    DASHBOARD: "/dashboard",
    REPORTS: "/reports",
    REPORT_DETAIL: (id: string) => `/reports/${id}`,
    CV: "/cv",
    JOBS: "/jobs",
    ANALYZE: "/analyze", // ← YENİ EKLENEN
    COVER_LETTERS: "/cover-letters",
    BILLING: "/billing",
    SETTINGS: "/settings",
  },
} as const;

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
} as const;

// Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const DOCUMENT_TYPES = {
  CV: "cv",
  JOB: "job",
} as const;
