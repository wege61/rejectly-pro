/**
 * Brand tokens for the Remotion compositions.
 * Mirrors src/styles/theme.ts — kept as a standalone copy because the
 * compositions render outside the Next.js app (no styled-components provider).
 */
export const brand = {
  bg: "#0B0B0D",
  bgPanel: "#151517",
  teal: "#35A29F",
  tealDeep: "#0B666A",
  tealLight: "#97FEED",
  red: "#EE5A5A",
  orange: "#EA7A18",
  green: "#10B981",
  greenLight: "#6EE7B7",
  text: "#F3F4F8",
  textDim: "#A5A9B3",
  textFaint: "#6B7280",
} as const;

export const FONT = "RejectlyRoboto";
export const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export const FPS = 30;

/**
 * Scenes are authored against a 1920x1080 stage. Vertical (1080x1920) renders
 * reuse the same components, so type and spacing are scaled by the ratio of the
 * actual width to that reference width.
 */
export const REFERENCE_WIDTH = 1920;
