# @repo/testing

Pacote compartilhado de utilitários e presets de teste do monorepo.

## O que ele expõe

- Presets de Vitest para Node/React/shared
- Setup de testes React
- API completa do Playwright (`export *`) via `@repo/testing/playwright`
- Factory de configuração Playwright (`createPlaywrightConfig`)

## Uso com Vitest

```ts
import { createNodeTestConfig } from "@repo/testing";
```

Subpaths disponíveis:

- `@repo/testing/vitest/node`
- `@repo/testing/vitest/react`
- `@repo/testing/setup/react`

## Uso com Playwright

### 1. Configuração do projeto

```ts
import { createPlaywrightConfig } from "@repo/testing/playwright";

export default createPlaywrightConfig({
  baseURL: process.env["PLAYWRIGHT_BASE_URL"] ?? "http://localhost:3000",
  testDir: "e2e",
  outputDir: "e2e/test-results",
});
```

### 2. Escrevendo specs

```ts
import { expect, test } from "@repo/testing/playwright";
import type { Page, Response } from "@repo/testing/playwright";
```

### 3. Execução

Cada app com E2E deve manter `@playwright/test` em `devDependencies` para usar o CLI (`./node_modules/.bin/playwright`).

## Opções de `createPlaywrightConfig`

- `baseURL` (obrigatório)
- `testDir` (opcional, padrão: `e2e`)
- `outputDir` (opcional, padrão: `test-results`)
