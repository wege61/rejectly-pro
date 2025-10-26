import { keyframes } from "styled-components";

export const theme = {
  colors: {
    // Primary
    primary: "#6366f1", // indigo-500
    primaryHover: "#4f46e5", // indigo-600
    primaryLight: "rgba(99, 102, 241, 0.1)", // indigo with opacity

    // Secondary (YENİ - Dark theme için)
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
    successHover: "#059669", // YENİ

    warning: "#f59e0b",
    warningLight: "rgba(245, 158, 11, 0.1)",
    warningHover: "#d97706", // YENİ

    error: "#ef4444",
    errorLight: "rgba(239, 68, 68, 0.1)",
    errorHover: "#dc2626", // YENİ

    info: "#3b82f6",
    infoLight: "rgba(59, 130, 246, 0.1)",
    infoHover: "#2563eb", // YENİ
  },

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

  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
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

export type Theme = typeof theme;
