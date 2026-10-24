"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { darkTheme } from "@/styles/theme";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "rj-theme";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// The inline script in app/layout.tsx sets data-theme before paint; this provider
// reads it back on mount and keeps it in sync when the visitor toggles.
// The styled-components theme object stays dark: legacy screens still read it,
// while redesigned screens use the --rj-* CSS variables that follow data-theme.
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setModeState(current === "dark" ? "dark" : "light");
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode); the choice then lasts for this page view.
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      <StyledThemeProvider theme={darkTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
