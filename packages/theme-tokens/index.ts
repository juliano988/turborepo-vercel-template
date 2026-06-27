/**
 * Tokens de tema sincronizados diretamente do daisyui e mapeados para antd v5.
 *
 * daisyui/theme/object exporta todos os temas como objetos JS puros com
 * valores oklch. Convertemos para hex aqui mesmo — sem scripts externos,
 * sem valores hardcoded.
 */

import type { ThemeConfig } from "antd";
import themes from "daisyui/theme/object.js";

// ---------------------------------------------------------------------------
// oklch → sRGB hex
// ---------------------------------------------------------------------------
function oklchToHex(str: string): string {
  const inner = str.match(/oklch\(([^)]+)\)/)?.[1];
  if (!inner) return "#000000";

  const parts = inner.trim().split(/\s+/);
  const Lraw = parts[0] ?? "0";
  const Craw = parts[1] ?? "0";
  const Hraw = parts[2] ?? "0";
  const L = parseFloat(Lraw) / (Lraw.includes("%") ? 100 : 1);
  const C = parseFloat(Craw);
  const H = parseFloat(Hraw) * (Math.PI / 180);

  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;

  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const toSRGB = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;

  const R = Math.round(Math.max(0, Math.min(1, toSRGB(rLin))) * 255);
  const G = Math.round(Math.max(0, Math.min(1, toSRGB(gLin))) * 255);
  const B = Math.round(Math.max(0, Math.min(1, toSRGB(bLin))) * 255);

  return (
    "#" +
    R.toString(16).padStart(2, "0") +
    G.toString(16).padStart(2, "0") +
    B.toString(16).padStart(2, "0")
  );
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
