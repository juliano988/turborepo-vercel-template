"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useThemeAntd } from "./ThemeContextAntd";

export function ThemeToggleAntd() {
  const { isDark, toggle } = useThemeAntd();

  return (
    <Button
      type="text"
      shape="circle"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    />
  );
}
