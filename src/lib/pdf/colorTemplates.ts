import { ColorTemplate } from "@/types/cvCustomization";

export const COLOR_TEMPLATES: ColorTemplate[] = [
  {
    key: "classic-blue",
    name: "Classic Blue",
    description: "Trustworthy, professional, corporate — the most universally accepted CV color",
    colors: {
      primary: "#2563eb",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#e5e7eb",
      highlight: "#10b981",
      highlightBg: "#f0fdf4",
    },
  },
  {
    key: "dark-navy",
    name: "Dark Navy",
    description: "Serious and authoritative — ideal for senior executive positions",
    colors: {
      primary: "#1e3a5f",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#d1d5db",
      highlight: "#10b981",
      highlightBg: "#f0fdf4",
    },
  },
  {
    key: "forest-green",
    name: "Forest Green",
    description: "Growth-oriented, balanced — popular in finance and sustainability sectors",
    colors: {
      primary: "#166534",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#d1d5db",
      highlight: "#10b981",
      highlightBg: "#f0fdf4",
    },
  },
  {
    key: "burgundy",
    name: "Burgundy",
    description: "Confident and distinctive — stands out while staying professional",
    colors: {
      primary: "#7f1d1d",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#d1d5db",
      highlight: "#10b981",
      highlightBg: "#f0fdf4",
    },
  },
  {
    key: "slate-gray",
    name: "Slate Gray",
    description: "Modern and minimal — lets your content take center stage",
    colors: {
      primary: "#475569",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#d1d5db",
      highlight: "#10b981",
      highlightBg: "#f0fdf4",
    },
  },
  {
    key: "deep-purple",
    name: "Deep Purple",
    description: "Creative and innovative — great for design, tech, and marketing roles",
    colors: {
      primary: "#5b21b6",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#d1d5db",
      highlight: "#10b981",
      highlightBg: "#f0fdf4",
    },
  },
];

export const DEFAULT_COLOR_TEMPLATE = COLOR_TEMPLATES[0]; // classic-blue

export function getColorTemplate(key: string): ColorTemplate {
  return COLOR_TEMPLATES.find((t) => t.key === key) || DEFAULT_COLOR_TEMPLATE;
}
