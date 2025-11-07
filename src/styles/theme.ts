import { keyframes } from "styled-components";

// Dark Theme Colors
const darkColors = {
  // Primary
  primary: "#6366f1", // indigo-500
  primaryHover: "#4f46e5", // indigo-600
  primaryLight: "rgba(99, 102, 241, 0.1)", // indigo with opacity

  // Secondary
  secondary: "#1e293b", // slate-800
  secondaryHover: "#334155", // slate-700

  // Neutral - DARK MODE
  background: "#0f172a", // slate-900
  backgroundAlt: "#1e293b", // slate-800
  surface: "#1e293b", // slate-800
  surfaceHover: "#334155", // slate-700

  // Text - DARK MODE
  textPrimary: "#f1f5f9", // slate-100
  textSecondary: "#94a3b8", // slate-400
  textTertiary: "#64748b", // slate-500

  // Borders - DARK MODE
  border: "#334155", // slate-700
  borderHover: "#475569", // slate-600

  // Status
  success: "#10b981",
  successLight: "rgba(16, 185, 129, 0.1)",
  successHover: "#059669",

  warning: "#f59e0b",
  warningLight: "rgba(245, 158, 11, 0.1)",
  warningHover: "#d97706",

  error: "#ef4444",
  errorLight: "rgba(239, 68, 68, 0.1)",
  errorHover: "#dc2626",

  info: "#3b82f6",
  infoLight: "rgba(59, 130, 246, 0.1)",
  infoHover: "#2563eb",
};

// Light Theme Colors
const lightColors = {
  // Primary - Lighter purple for better contrast on light backgrounds
  primary: "#5B5FCD",
  primaryHover: "#4448B3",
  primaryLight: "#E5E8FB",

  // Secondary
  secondary: "#F0F2F5",
  secondaryHover: "#E5E7EB",

  // Neutral - LIGHT MODE
  background: "#F5F7FA", // Very light neutral
  backgroundAlt: "#F0F2F5", // Slightly darker for sidebar
  surface: "#FFFFFF", // Pure white for cards
  surfaceHover: "#F9FAFB", // Subtle hover state

  // Text - LIGHT MODE
  textPrimary: "#1F2937", // Dark slate grey for headings
  textSecondary: "#4B5563", // Mid-grey for body text
  textTertiary: "#6B7280", // Lighter grey for hints

  // Borders - LIGHT MODE
  border: "#D1D5DB", // Soft grey borders
  borderHover: "#9CA3AF", // Darker on hover

  // Status - Adapted for light backgrounds
  success: "#28A745", // Softer green
  successLight: "#E9F7EF", // Light green background
  successHover: "#218838",

  warning: "#F39C12", // Warm amber
  warningLight: "#FFF7E6", // Light yellow background
  warningHover: "#E08E0B",

  error: "#E74C3C", // Clear red
  errorLight: "#FDECEA", // Light red background
  errorHover: "#C0392B",

  info: "#3b82f6",
  infoLight: "#EFF6FF", // Light blue background
  infoHover: "#2563eb",
};

const baseTheme = {

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  shadowDark: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  shadowLight: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
    md: "0 2px 4px -1px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
    lg: "0 8px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
    xl: "0 16px 20px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)",
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "350ms ease",
  },

  animations: {
    // Fade animations
    fadeIn: keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `,
    fadeOut: keyframes`
      from { opacity: 1; }
      to { opacity: 0; }
    `,

    // Slide animations
    slideInUp: keyframes`
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    `,
    slideInDown: keyframes`
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    `,

    // Scale animations
    scaleIn: keyframes`
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    `,

    // Bounce animation
    bounce: keyframes`
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    `,

    // Pulse animation
    pulse: keyframes`
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    `,

    // Ripple effect
    ripple: keyframes`
      0% {
        transform: scale(0);
        opacity: 0.5;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    `,
  },
};

// Create dark theme by combining base theme with dark colors
export const darkTheme = {
  ...baseTheme,
  colors: darkColors,
  shadow: baseTheme.shadowDark,
};

// Create light theme by combining base theme with light colors
export const lightTheme = {
  ...baseTheme,
  colors: lightColors,
  shadow: baseTheme.shadowLight,
};

// Default theme (dark)
export const theme = darkTheme;

export type Theme = typeof darkTheme;
