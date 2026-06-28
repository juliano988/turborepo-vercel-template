const KEY = "theme-preference";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

/** Em prod deriva ".example.com"; em localhost não define domain (compartilhado por porta). */
function getDomain(): string {
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") return "";
  const parts = h.split(".");
  return parts.length > 2 ? "." + parts.slice(-2).join(".") : h;
}

export function readThemePreference(): "dark" | "light" | null {
  const match = document.cookie.match(/(?:^|;\s*)theme-preference=([^;]+)/);
  const val = match?.[1];
  return val === "dark" || val === "light" ? val : null;
}

export function writeThemePreference(value: "dark" | "light"): void {
  const domain = getDomain();
  const domainAttr = domain ? `; domain=${domain}` : "";
  document.cookie = `${KEY}=${value}; path=/${domainAttr}; max-age=${MAX_AGE}; SameSite=Lax`;
}
