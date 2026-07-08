import themes from "daisyui/theme/object.js";
import { ScrollbarTokens } from "../types";
import blendOnBg from "./blendOnBg";
import oklchToHex from "./oklchToHex";

export default function buildScrollbarTokens(
  theme: (typeof themes)[keyof typeof themes]
): ScrollbarTokens {
  const c = (key: string) => oklchToHex(theme[key as keyof typeof theme]);
  const rem = (key: string) =>
    Math.round(parseFloat(theme[key as keyof typeof theme]) * 16);

  return {
    containerBorder: c("--color-base-300"),
    containerBackground: c("--color-base-100"),
    containerRadius: rem("--radius-box"),
    track: c("--color-base-200"),
    thumb: blendOnBg(c("--color-base-content"), c("--color-base-200"), 0.2),
    thumbHover: blendOnBg(
      c("--color-base-content"),
      c("--color-base-200"),
      0.34
    ),
  };
}
