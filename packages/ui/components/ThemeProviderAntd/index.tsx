"use client";

import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { FONT_FAMILY } from "../../constants";
import { ThemeContextAntd } from "../../contexts/ThemeContext";
import {
  readThemePreference,
  writeThemePreference,
} from "../../modules/themeStorage";
import {
  darkScrollbarTokens,
  darkTokens,
  lightScrollbarTokens,
  lightTokens,
} from "../../modules/tokens";

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

  const activeTokens = isDark ? darkTokens : lightTokens;
  const activeScrollbarTokens = isDark
    ? darkScrollbarTokens
    : lightScrollbarTokens;

  return (
    <ThemeContextAntd.Provider value={{ isDark, toggle }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            ...activeTokens,
            fontFamily: FONT_FAMILY,
          },
        }}
      >
        <style>{`
          * {
            scrollbar-gutter: stable;
            scrollbar-width: thin;
            scrollbar-color: ${activeScrollbarTokens.thumb} ${activeScrollbarTokens.track};
          }

          *::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }

          *::-webkit-scrollbar-track {
            background: ${activeScrollbarTokens.track};
            border-radius: 999px;
          }

          *::-webkit-scrollbar-thumb {
            background: ${activeScrollbarTokens.thumb};
            border-radius: 999px;
            border: 2px solid ${activeScrollbarTokens.track};
          }

          *::-webkit-scrollbar-thumb:hover {
            background: ${activeScrollbarTokens.thumbHover};
          }
        `}</style>
        {children}
      </ConfigProvider>
    </ThemeContextAntd.Provider>
  );
}
