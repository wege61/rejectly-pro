import { keyframes } from "styled-components";

// Dark Theme Colors
const darkColors = {
  // Primary - Cool Spectrum
  primary: "#35A29F", // primary-500
  primaryHover: "#0B666A", // primary-700
  primaryLight: "rgba(53, 162, 159, 0.1)", // primary-500 with opacity

  // Secondary
  secondary: "#121623", // dark-card
  secondaryHover: "#1a1f2e", // slightly lighter

  // Neutral - DARK MODE
  background: "#0C0F18", // dark-bg
  backgroundAlt: "#121623", // dark-card
  surface: "#121623", // dark-card
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

// Light Theme Colors
const lightColors = {
  // Primary - Cool Spectrum for light mode
  primary: "#0B666A", // primary-700 for better contrast
  primaryHover: "#071952", // primary-900
  primaryLight: "rgba(151, 254, 237, 0.2)", // primary-200 with opacity

  // Secondary
  secondary: "#F4F7FA", // light-bg
  secondaryHover: "#E5E7EB",

  // Neutral - LIGHT MODE
  background: "#F4F7FA", // light-bg
  backgroundAlt: "#F4F7FA", // light-bg
  surface: "#FFFFFF", // light-card
  surfaceHover: "#F3F4F6", // Subtle hover state

  // Text - LIGHT MODE
  textPrimary: "#1E1E2A", // light-text
  textSecondary: "#5C6570", // light-subtext
  textTertiary: "#6B7280", // Lighter grey for hints

  // Borders - LIGHT MODE
  border: "#97FEED", // primary-200
  borderHover: "#35A29F", // primary-500

  // Status - Adapted for light backgrounds
  success: "#28A745", // Softer green for readability
  successLight: "#E9F7EF", // Light green background
  successHover: "#218838",

  warning: "#F39C12", // Warm amber
  warningLight: "#FFF7E6", // Light yellow background
  warningHover: "#E08E0B",

  error: "#E74C3C", // Clear red
  errorLight: "#FDECEA", // Light red background
  errorHover: "#C0392B",

  info: "#35A29F", // primary-500
  infoLight: "rgba(53, 162, 159, 0.1)", // primary-500 with opacity
  infoHover: "#0B666A", // primary-700
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
