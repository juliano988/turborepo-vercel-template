import type { ThemeConfig } from "antd";
import themes from "daisyui/theme/object.js";
import { formatHex, parse } from "culori";

function oklchToHex(str: string): string {
  const color = parse(str);
  return color ? (formatHex(color) ?? "#000000") : "#000000";
}

type Token = NonNullable<ThemeConfig["token"]>;

function buildTokens(theme: (typeof themes)[keyof typeof themes]): Token {
  const c = (key: string) => oklchToHex(theme[key as keyof typeof theme]);
  const rem = (key: string) =>
    Math.round(parseFloat(theme[key as keyof typeof theme]) * 16);

  return {
    colorBgContainer: c("--color-base-100"),
    colorBgLayout: c("--color-base-200"),
    colorBgElevated: c("--color-base-100"),
    colorBorder: c("--color-base-300"),
    colorSplit: c("--color-base-300"),
    colorText: c("--color-base-content"),
    colorTextSecondary: c("--color-base-content"),
    colorTextTertiary: c("--color-base-content"),
    colorTextHeading: c("--color-neutral-content"),
    colorPrimary: c("--color-primary"),
    colorInfo: c("--color-info"),
    colorSuccess: c("--color-success"),
    colorWarning: c("--color-warning"),
    colorError: c("--color-error"),
    borderRadius: rem("--radius-box"),
    borderRadiusLG: rem("--radius-box"),
    borderRadiusSM: rem("--radius-field"),
  };
}

export const lightTokens: Token = buildTokens(themes.light);
export const darkTokens: Token = buildTokens(themes.dark);
