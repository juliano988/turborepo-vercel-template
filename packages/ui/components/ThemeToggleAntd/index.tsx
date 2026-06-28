"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "antd";
import { useThemeAntd } from "../../modules/ThemeContext";

export function ThemeToggleAntd() {
  const { isDark, toggle } = useThemeAntd();

  return (
    <Button
      type="text"
      shape="circle"
      icon={isDark ? <Sun size={16} /> : <Moon size={16} />}
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    />
  );
}
