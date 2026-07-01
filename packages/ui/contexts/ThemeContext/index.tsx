"use client";

import { createContext, useContext } from "react";
import type { ThemeContextValue } from "../../types";

export const ThemeContextAntd = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function useThemeAntd(): ThemeContextValue {
  return useContext(ThemeContextAntd);
}
