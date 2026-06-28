import themes from "daisyui/theme/object.js";

type DaisyTheme = (typeof themes)[keyof typeof themes];

// Mapeamento DaisyUI → variáveis CSS do fumadocs
const FD_MAP: Record<string, keyof DaisyTheme> = {
  "--color-fd-background": "--color-base-100",
  "--color-fd-foreground": "--color-base-content",
  "--color-fd-muted": "--color-base-200",
  "--color-fd-muted-foreground": "--color-base-content",
  "--color-fd-popover": "--color-base-100",
  "--color-fd-popover-foreground": "--color-base-content",
  "--color-fd-card": "--color-base-200",
  "--color-fd-card-foreground": "--color-base-content",
  "--color-fd-border": "--color-base-300",
  "--color-fd-primary": "--color-primary",
  "--color-fd-primary-foreground": "--color-primary-content",
  "--color-fd-secondary": "--color-base-200",
  "--color-fd-secondary-foreground": "--color-base-content",
  "--color-fd-accent": "--color-base-300",
  "--color-fd-accent-foreground": "--color-base-content",
  "--color-fd-ring": "--color-primary",
};

/**
 * Injeta as cores do tema DaisyUI nas variáveis CSS do fumadocs.
 * Chamado no cliente sempre que o tema muda.
 */
export function applyFumadocsTheme(
  themeName: string,
  root: HTMLElement = document.documentElement,
): void {
  const theme = (themes as Record<string, DaisyTheme>)[themeName];
  if (!theme) return;

  for (const [fdVar, daisyKey] of Object.entries(FD_MAP)) {
    const value = theme[daisyKey];
    if (value) root.style.setProperty(fdVar, String(value));
  }
}
