import { ScoreRange, UserState, ScoreMessage } from "./types";

// Score range thresholds
export const SCORE_THRESHOLDS = {
  LOW_MAX: 49,
  MEDIUM_MAX: 69,
} as const;

// Score messages based on score range and user state
export const SCORE_MESSAGES: Record<ScoreRange, Record<UserState, ScoreMessage>> = {
  low: {
    free: {
      title: "Your CV Needs Improvement",
      subtitle: "83% of users with similar scores got rejected",
      cta: "Upgrade Now to Fix Critical Issues",
      variant: "danger",
    },
    pro_pending: {
      title: "Let's Fix Your CV",
      subtitle: "We've identified critical issues that need attention",
      cta: "Generate Optimized CV",
      variant: "warning",
    },
    pro_optimized: {
      title: "Major Improvements Made",
      subtitle: "We fixed critical issues in your CV",
      highlight: "problems fixed",
      variant: "success",
    },
  },
  medium: {
    free: {
      title: "Good Start, Room to Grow",
      subtitle: "Users who upgraded increased their interview rate by 67%",
      cta: "Unlock Your Full Potential",
      variant: "warning",
    },
    pro_pending: {
      title: "Ready to Optimize",
      subtitle: "Your CV has potential - let's make it shine",
      cta: "Generate Optimized CV",
      variant: "warning",
    },
    pro_optimized: {
      title: "Nice Improvements",
      subtitle: "Your CV is now more competitive",
      highlight: "score increased",
      variant: "success",
    },
  },
  high: {
    free: {
      title: "Great Match - But Is It ATS-Ready?",
      subtitle: "67% of CVs get rejected by ATS before a human sees them. Let us optimize yours.",
      cta: "Get ATS-Optimized CV",
      variant: "warning",
    },
    pro_pending: {
      title: "Let's Make It ATS-Perfect",
      subtitle: "Great match score! Now let's ensure your CV passes ATS filters with optimized formatting and keywords.",
      cta: "Generate ATS-Optimized CV",
      variant: "success",
    },
    pro_optimized: {
      title: "CV Optimized & ATS-Ready!",
      subtitle: "Your CV is now formatted for ATS systems with improved language and keywords",
      highlight: "ATS-optimized",
      variant: "success",
    },
  },
};

// Score labels for display
export const SCORE_LABELS: Record<ScoreRange, string> = {
  low: "Needs Improvement",
  medium: "Good Match",
  high: "Excellent Match",
};

// Severity configuration
export const SEVERITY_CONFIG = {
  critical: {
    label: "Critical Issues",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
  important: {
    label: "Important Gaps",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  minor: {
    label: "Minor Tweaks",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.1)",
  },
} as const;

// Chart colors for improvement breakdown
export const CHART_COLORS = [
  "#35A29F", // primary teal
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#14b8a6", // teal light
] as const;

// Testimonials for upgrade section
export const TESTIMONIALS = [
  {
    text: "Got 3 interviews in my first week after upgrading!",
    author: "Sarah M.",
    role: "Software Engineer",
  },
  {
    text: "The optimized CV helped me land my dream job.",
    author: "Michael R.",
    role: "Product Manager",
  },
  {
    text: "Best investment in my job search. Highly recommend!",
    author: "Emily K.",
    role: "Data Analyst",
  },
] as const;

// Feature comparison for upgrade section
export const FEATURE_COMPARISON = {
  free: [
    { feature: "Basic CV Analysis", included: true },
    { feature: "Match Score", included: true },
    { feature: "Sample Improvements", included: true },
    { feature: "Full Optimization", included: false },
    { feature: "ATS Optimization", included: false },
    { feature: "Cover Letter Generator", included: false },
  ],
  pro: [
    { feature: "Basic CV Analysis", included: true },
    { feature: "Match Score", included: true },
    { feature: "Sample Improvements", included: true },
    { feature: "Full Optimization", included: true },
    { feature: "ATS Optimization", included: true },
    { feature: "Cover Letter Generator", included: true },
  ],
} as const;
