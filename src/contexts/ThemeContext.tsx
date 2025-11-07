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
  // Initialize theme from localStorage or default to dark
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    if (savedTheme) {
      setMode(savedTheme);
    }
    setMounted(true);
  }, []);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", mode);
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
