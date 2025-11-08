"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { darkTheme, lightTheme, Theme } from "@/styles/theme";

type ThemeMode = "dark" | "light";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from data-theme attribute (set by blocking script) or default to dark
  const getInitialTheme = (): ThemeMode => {
    if (typeof window !== 'undefined') {
      const htmlTheme = document.documentElement.getAttribute('data-theme') as ThemeMode | null;
      if (htmlTheme === 'light' || htmlTheme === 'dark') {
        return htmlTheme;
      }
    }
    return 'dark';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Save theme preference to localStorage and update data-theme attribute when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", mode);
      document.documentElement.setAttribute('data-theme', mode);
      // CSS variables are now controlled by CSS selectors in layout.tsx
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const theme: Theme = mode === "dark" ? darkTheme : lightTheme;

  // Prevent flash of unstyled content
  if (!mounted) {
    return <StyledThemeProvider theme={darkTheme}>{children}</StyledThemeProvider>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
