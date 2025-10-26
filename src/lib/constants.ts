// Pricing
export const PRICING = {
  FREE: {
    name: "Free Summary",
    price: 0,
    features: [
      "Upload 1 CV",
      "Analyze up to 3 job postings",
      "Basic keyword gap analysis",
      "Free improved summary",
      "Match score",
    ],
  },
  PRO: {
    name: "Pro Report",
    price: 9, // USD
    priceInCents: 900,
    features: [
      "Everything in Free",
      "Detailed keyword analysis",
      "3 rewritten bullet points",
      "5 missing keywords highlighted",
      "3 role recommendations",
      "ATS compatibility flags",
      "Downloadable PDF report",
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
    maxAnalysesPerMonth: 5,
  },
  PRO_USER: {
    maxJobsPerAnalysis: 10,
    maxAnalysesPerMonth: -1, // unlimited
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
  },
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    RESET_PASSWORD: "/reset-password",
  },
  APP: {
    DASHBOARD: "/dashboard",
    REPORTS: "/reports",
    REPORT_DETAIL: (id: string) => `/reports/${id}`,
    CV: "/cv",
    JOBS: "/jobs",
    ANALYZE: "/analyze", // ← YENİ EKLENEN
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
