"use client";

import { createContext, useContext } from "react";

export interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeContextAntd = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function useThemeAntd(): ThemeContextValue {
  return useContext(ThemeContextAntd);
}
