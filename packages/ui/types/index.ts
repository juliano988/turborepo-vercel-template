import { ReactNode } from "react";

export interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

export interface ThemeProviderFumaDocsProps {
  children: ReactNode;
  /** Tema inicial lido do cookie no servidor (evita flash). */
  defaultTheme?: string;
}
