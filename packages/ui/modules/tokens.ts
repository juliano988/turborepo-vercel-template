import type { ThemeConfig } from "antd";
import themes from "daisyui/theme/object.js";
import { converter, formatHex, parse } from "culori";

const toRgb = converter("rgb");

function blendOnBg(fg: string, bg: string, alpha: number): string {
  const fgRgb = toRgb(parse(fg));
  const bgRgb = toRgb(parse(bg));
  if (!fgRgb || !bgRgb) return "#000000";
  return (
    formatHex({
      mode: "rgb",
      r: (fgRgb.r ?? 0) * alpha + (bgRgb.r ?? 0) * (1 - alpha),
      g: (fgRgb.g ?? 0) * alpha + (bgRgb.g ?? 0) * (1 - alpha),
      b: (fgRgb.b ?? 0) * alpha + (bgRgb.b ?? 0) * (1 - alpha),
    }) ?? "#000000"
  );
}

function oklchToHex(str: string): string {
  const color = parse(str);
  return color ? (formatHex(color) ?? "#000000") : "#000000";
}

type Token = NonNullable<ThemeConfig["token"]>;

function buildTokens(theme: (typeof themes)[keyof typeof themes]): Token {
  const c = (key: string) => oklchToHex(theme[key as keyof typeof theme]);
  const rem = (key: string) =>
    Math.round(parseFloat(theme[key as keyof typeof theme]) * 16);
  const px = (key: string) => parseInt(theme[key as keyof typeof theme], 10);

  return {
    colorBgContainer: c("--color-base-100"),
    colorBgLayout: c("--color-base-200"),
    colorBgElevated: c("--color-base-100"),
    colorBorder: c("--color-base-300"),
    colorSplit: c("--color-base-300"),
    colorText: c("--color-base-content"),
    colorTextSecondary: blendOnBg(
      c("--color-base-content"),
      c("--color-base-100"),
      0.65
    ),
    colorTextTertiary: blendOnBg(
      c("--color-base-content"),
      c("--color-base-100"),
      0.45
    ),
    colorTextHeading: c("--color-base-content"),
    colorPrimary: c("--color-primary"),
    colorInfo: c("--color-info"),
    colorSuccess: c("--color-success"),
    colorWarning: c("--color-warning"),
    colorError: c("--color-error"),
    lineWidth: px("--border"),
    borderRadius: rem("--radius-box"),
    borderRadiusSM: rem("--radius-field"),
  };
}

export const lightTokens: Token = buildTokens(themes.light);
export const darkTokens: Token = buildTokens(themes.dark);
