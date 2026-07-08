# @repo/ui

Biblioteca de componentes e utilitários de tema compartilhados entre os apps do monorepo. Abstrai a integração entre **Ant Design**, **DaisyUI/Tailwind** e **FumaDocs**, mantendo a preferência de tema sincronizada via cookie entre subdomínios.

## Exportações

```ts
import {
  ThemeProviderAntd, // Provider de tema para apps Ant Design
  ThemeProviderFumaDocs, // Provider de tema para apps FumaDocs/DaisyUI
  ThemeToggleAntd, // Botão de alternância de tema (Ant Design)
  ThemeToggleDaisyUI, // Botão de alternância de tema (DaisyUI)
  ThemeContextAntd, // Context do tema Ant Design
  useThemeAntd, // Hook para consumir o ThemeContextAntd
  readThemePreference, // Lê preferência salva no cookie
  writeThemePreference, // Salva preferência no cookie
  lightTokens, // Design tokens Ant Design — tema claro
  darkTokens, // Design tokens Ant Design — tema escuro
} from "@repo/ui";
```

Todos os ícones do `lucide-react` também são re-exportados.

## Componentes

### `ThemeProviderAntd`

Provider para apps que usam **Ant Design**. Gerencia estado `isDark`, aplica tokens de cor derivados do DaisyUI e expõe `ThemeContextAntd`.

```tsx
<ThemeProviderAntd>{children}</ThemeProviderAntd>
```

### `ThemeProviderFumaDocs`

Provider para apps que usam **FumaDocs + DaisyUI**. Usa `next-themes` internamente e sincroniza:

- Classe `dark` no `<html>` (Tailwind / FumaDocs)
- Atributo `data-theme` (DaisyUI)
- Cookie de preferência compartilhado entre subdomínios

| Prop           | Tipo     | Padrão    | Descrição                                             |
| -------------- | -------- | --------- | ----------------------------------------------------- |
| `defaultTheme` | `string` | `"light"` | Tema inicial lido do cookie no servidor (evita flash) |

```tsx
<ThemeProviderFumaDocs defaultTheme={cookieTheme}>
  {children}
</ThemeProviderFumaDocs>
```

## Módulos internos

### `themeStorage`

Lê e grava a preferência de tema em um cookie compartilhado (`theme-preference`) entre subdomínios.

- Em produção usa `domain=.example.com`; em `localhost` omite o atributo `domain`
- Tem fallback automático para contornar a restrição de cookies em domínios da Public Suffix List (ex: `.vercel.app`)

### `fumadocsTheme`

Injeta as variáveis CSS do FumaDocs a partir de um tema DaisyUI, chamado sempre que o tema muda no cliente.

### `tokens`

Converte as cores OKLCH dos temas `light`/`dark` do DaisyUI em tokens compatíveis com o `ConfigProvider` do Ant Design, exportando `lightTokens` e `darkTokens`.

## Tipos

```ts
interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}
```

## Constantes

| Constante              | Valor                              |
| ---------------------- | ---------------------------------- |
| `THEME_COOKIE_KEY`     | `"theme-preference"`               |
| `THEME_COOKIE_MAX_AGE` | `31536000` (1 ano em segundos)     |
| `FONT_FAMILY`          | Stack sans-serif padrão do sistema |
