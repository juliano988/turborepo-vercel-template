"use client";

import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";
import { lightTokens, darkTokens } from "@repo/theme-tokens";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const tokens = isDark ? darkTokens : lightTokens;
    document.body.style.backgroundColor = tokens.colorBgContainer ?? "";
    document.body.style.color = tokens.colorText ?? "";
  }, [isDark]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          ...(isDark ? darkTokens : lightTokens),
          fontFamily:
            "ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
