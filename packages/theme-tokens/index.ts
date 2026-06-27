/**
 * Tokens de tema sincronizados diretamente do daisyui e mapeados para antd v5.
 *
 * daisyui/theme/object exporta todos os temas como objetos JS puros com
 * valores oklch. Convertemos para hex aqui mesmo — sem scripts externos,
 * sem valores hardcoded.
 */

import type { ThemeConfig } from "antd";
import themes from "daisyui/theme/object.js";
import { formatHex, parse } from "culori";

// ---------------------------------------------------------------------------
// oklch → sRGB hex
// ---------------------------------------------------------------------------
function oklchToHex(str: string): string {
  const color = parse(str);
  return color ? (formatHex(color) ?? "#000000") : "#000000";
}

// ---------------------------------------------------------------------------
// Mapeamento DaisyUI → antd
// ---------------------------------------------------------------------------
type Token = NonNullable<ThemeConfig["token"]>;

function buildTokens(theme: (typeof themes)[keyof typeof themes]): Token {
  const c = (key: string) => oklchToHex(theme[key as keyof typeof theme]);
  const rem = (key: string) =>
    Math.round(parseFloat(theme[key as keyof typeof theme]) * 16);

  return {
    // Backgrounds
    colorBgContainer: c("--color-base-100"),
    colorBgLayout: c("--color-base-200"),
    colorBgElevated: c("--color-base-100"),

    // Borders
    colorBorder: c("--color-base-300"),
    colorSplit: c("--color-base-300"),

    // Text
    colorText: c("--color-base-content"),
    colorTextSecondary: c("--color-base-content"),
    colorTextTertiary: c("--color-base-content"),
    colorTextHeading: c("--color-neutral-content"),

    // Semânticas
    colorPrimary: c("--color-primary"),
    colorInfo: c("--color-info"),
    colorSuccess: c("--color-success"),
    colorWarning: c("--color-warning"),
    colorError: c("--color-error"),

    // Shape
    borderRadius: rem("--radius-box"),
    borderRadiusLG: rem("--radius-box"),
    borderRadiusSM: rem("--radius-field"),
  };
}

export const lightTokens: Token = buildTokens(themes.light);
export const darkTokens: Token = buildTokens(themes.dark);
