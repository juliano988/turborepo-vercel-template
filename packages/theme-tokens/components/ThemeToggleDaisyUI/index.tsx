"use client";

import { useEffect, useState } from "react";
import {
  readThemePreference,
  writeThemePreference,
} from "../../modules/themeStorage";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.166 17.834a.75.75 0 0 0-1.06 1.06l1.59 1.591a.75.75 0 1 0 1.061-1.06l-1.591-1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 6.166a.75.75 0 0 0 1.06 1.06l1.59-1.59a.75.75 0 0 0-1.06-1.061L6.166 6.166Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
          "(prefers-color-scheme: dark)",
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
      className="btn btn-ghost btn-circle"
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
