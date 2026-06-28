"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";
import { applyFumadocsTheme } from "../../modules/fumadocsTheme";
import {
  readThemePreference,
  writeThemePreference,
} from "../../modules/themeStorage";
import { ThemeProviderFumaDocsProps } from "../../types";

function ThemeSync() {
  const { resolvedTheme, setTheme } = useTheme();

  // Ao montar: sincroniza do cookie → garante que mudanças feitas em outros
  // apps (que só atualizam o cookie) reflitam aqui, sobrescrevendo o localStorage.
  useEffect(() => {
    const cookie = readThemePreference();
    if (cookie) setTheme(cookie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ao mudar: sincroniza para o cookie + data-theme + fumadocs vars
  useEffect(() => {
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      writeThemePreference(resolvedTheme);
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      applyFumadocsTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  return null;
}

/**
 * Provider genérico de tema para todos os apps do monorepo.
 * - Aplica a classe `dark` no <html> (compatível com fumadocs e Tailwind)
 * - Aplica `data-theme` no <html> (compatível com DaisyUI)
 * - Sincroniza a preferência no cookie compartilhado entre subdomínios
 */
export function ThemeProviderFumaDocs({
  children,
  defaultTheme = "light",
}: ThemeProviderFumaDocsProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
