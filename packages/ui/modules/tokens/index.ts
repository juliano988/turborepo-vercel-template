import themes from "daisyui/theme/object.js";
import buildScrollbarTokens from "./modules/buildScrollbarTokens";
import buildTokens from "./modules/buildTokens";
import { ScrollbarTokens, Token } from "./types";

export const lightTokens: Token = buildTokens(themes.light);
export const darkTokens: Token = buildTokens(themes.dark);
export const lightScrollbarTokens: ScrollbarTokens = buildScrollbarTokens(
  themes.light
);
export const darkScrollbarTokens: ScrollbarTokens = buildScrollbarTokens(
  themes.dark
);
