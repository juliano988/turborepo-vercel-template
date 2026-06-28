import { THEME_COOKIE_KEY, THEME_COOKIE_MAX_AGE } from "../constants";

/** Em prod deriva ".example.com"; em localhost não define domain (compartilhado por porta). */
function getDomain(): string {
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") return "";
  const parts = h.split(".");
  return parts.length > 2 ? "." + parts.slice(-2).join(".") : h;
}

export function readThemePreference(): "dark" | "light" | null {
  const match = document.cookie.match(
    /(?:^|;\s*)theme-preference=([^;]+)/
  );
  const val = match?.[1];
  return val === "dark" || val === "light" ? val : null;
}

export function writeThemePreference(value: "dark" | "light"): void {
  const domain = getDomain();
  const domainAttr = domain ? `; domain=${domain}` : "";
  document.cookie = `${THEME_COOKIE_KEY}=${value}; path=/${domainAttr}; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}
