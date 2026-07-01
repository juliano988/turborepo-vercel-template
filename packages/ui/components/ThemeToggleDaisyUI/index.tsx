"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  readThemePreference,
  writeThemePreference,
} from "../../modules/themeStorage";

export function ThemeToggleDaisyUI() {
  const [isDark, setIsDark] = useState(false);

  function applyTheme(dark: boolean, persist = false) {
    setIsDark(dark);
    const t = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    if (persist) writeThemePreference(t);
  }

  useEffect(() => {
    function syncFromStorage() {
      const stored = readThemePreference();
      if (stored) {
        applyTheme(stored === "dark");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        applyTheme(prefersDark);
      }
    }

    syncFromStorage();

    // Resincroniza ao restaurar do bfcache (back/forward navigation)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) syncFromStorage();
    };
    window.addEventListener("pageshow", handlePageShow);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqHandler = (e: MediaQueryListEvent) => {
      if (!readThemePreference()) applyTheme(e.matches);
    };
    mq.addEventListener("change", mqHandler);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      mq.removeEventListener("change", mqHandler);
    };
  }, []);

  const toggle = () => applyTheme(!isDark, true);

  return (
    <button
      className="btn btn-circle"
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
