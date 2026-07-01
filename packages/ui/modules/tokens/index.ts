import themes from "daisyui/theme/object.js";
import blendOnBg from "./modules/blendOnBg";
import oklchToHex from "./modules/oklchToHex";
import { Token } from "./types";

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
