"use client";

import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { ThemeContextAntd } from "./ThemeContextAntd";
import { darkTokens, lightTokens } from "./tokens";

const FONT_FAMILY =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const STORAGE_KEY = "theme-preference";

export default function ThemeProviderAntd({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setIsDark(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const tokens = isDark ? darkTokens : lightTokens;
    document.body.style.backgroundColor = tokens.colorBgContainer ?? "";
    document.body.style.color = tokens.colorText ?? "";
  }, [isDark]);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return (
    <ThemeContextAntd.Provider value={{ isDark, toggle }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            ...(isDark ? darkTokens : lightTokens),
            fontFamily: FONT_FAMILY,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContextAntd.Provider>
  );
}
