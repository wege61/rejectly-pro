import { keyframes } from "styled-components";

// Dark Theme Colors
const darkColors = {
  // Primary - Cool Spectrum
  primary: "#35A29F", // primary-500
  primaryHover: "#0B666A", // primary-700
  primaryLight: "rgba(53, 162, 159, 0.1)", // primary-500 with opacity

  // Secondary
  secondary: "#000000", // dark-card
  secondaryHover: "#1a1f2e", // slightly lighter

  // Neutral - DARK MODE
  background: "#151517", // dark-bg
  backgroundAlt: "#151517", // content area
  backgroundAlt2: "#151517", // dark-card (modals, sheets)
  backgroundAlt3: "#000000", // slightly lighter for contrast
  surface: "#000000", // dark-card (sidebar)
  surfaceHover: "#1a1f2e", // slightly lighter

  // Text - DARK MODE
  textPrimary: "#F3F4F8", // dark-text
  textSecondary: "#A5A9B3", // dark-subtext
  textTertiary: "#6B7280", // lighter grey

  // Borders - DARK MODE
  border: "rgba(255, 255, 255, 0.08)", // subtle border
  borderHover: "rgba(255, 255, 255, 0.15)", // slightly more visible

  // Status
  success: "#6EE7B7",
  successLight: "rgba(110, 231, 183, 0.1)",
  successHover: "#4ade80",

  warning: "#f59e0b",
  warningLight: "rgba(245, 158, 11, 0.1)",
  warningHover: "#d97706",

  error: "#ef4444",
  errorLight: "rgba(239, 68, 68, 0.1)",
  errorHover: "#dc2626",

  info: "#35A29F",
  infoLight: "rgba(53, 162, 159, 0.1)",
  infoHover: "#0B666A",
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

// Dark theme (only theme)
export const darkTheme = {
  ...baseTheme,
  colors: darkColors,
  shadow: baseTheme.shadowDark,
};

export const theme = darkTheme;

export type Theme = typeof darkTheme;
