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

  // Save theme preference to localStorage and update CSS variables when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", mode);
      const root = document.documentElement;
      root.setAttribute('data-theme', mode);

      // Update CSS variables
      if (mode === 'light') {
        root.style.setProperty('--bg-color', '#F5F7FA');
        root.style.setProperty('--text-color', '#1F2937');
        root.style.setProperty('--surface-color', '#FFFFFF');
        root.style.setProperty('--border-color', '#D1D5DB');
      } else {
        root.style.setProperty('--bg-color', '#0f172a');
        root.style.setProperty('--text-color', '#f1f5f9');
        root.style.setProperty('--surface-color', '#1e293b');
        root.style.setProperty('--border-color', '#334155');
      }
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
