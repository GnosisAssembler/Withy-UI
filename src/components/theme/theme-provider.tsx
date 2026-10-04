"use client";

import * as React from "react";
import { themeStorageKey, themes, type ThemeName } from "@/lib/theme";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const themeEvent = "sprig-theme-change";

function isThemeName(value: string | undefined): value is ThemeName {
  return themes.includes(value as ThemeName);
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(themeEvent, onStoreChange);
  return () => window.removeEventListener(themeEvent, onStoreChange);
}

function getSnapshot(): ThemeName {
  const current = document.documentElement.dataset.theme;
  return isThemeName(current) ? current : "light";
}

function getServerSnapshot(): ThemeName {
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = React.useCallback((next: ThemeName) => {
    document.documentElement.dataset.theme = next;
    localStorage.setItem(themeStorageKey, next);
    window.dispatchEvent(new Event(themeEvent));
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
