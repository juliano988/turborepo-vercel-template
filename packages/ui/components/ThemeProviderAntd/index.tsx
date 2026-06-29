"use client";

import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { FONT_FAMILY } from "../../constants";
import { ThemeContextAntd } from "../../modules/ThemeContext";
import {
  readThemePreference,
  writeThemePreference,
} from "../../modules/themeStorage";
import { darkTokens, lightTokens } from "../../modules/tokens";

export default function ThemeProviderAntd({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = readThemePreference();
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!readThemePreference()) {
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
      writeThemePreference(next ? "dark" : "light");
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
