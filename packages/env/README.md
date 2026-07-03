# @repo/env

Utilitário para carregamento de variáveis de ambiente no monorepo.

## O que faz

Localiza automaticamente a raiz do monorepo (buscando o arquivo `turbo.json`) e carrega o `.env` raiz via `dotenv`. Variáveis já definidas no ambiente (ex: em produção na Vercel) não são sobrescritas.

## Uso

Envolva a configuração do Next.js com `withEnv` em qualquer app do monorepo:

```ts
// apps/minha-app/next.config.ts
import { withEnv } from "@repo/env";

export default withEnv({
  // suas opções do Next.js
});
```

## API

### `withEnv(nextConfig?)`

| Parâmetro    | Tipo         | Padrão | Descrição                          |
| ------------ | ------------ | ------ | ---------------------------------- |
| `nextConfig` | `NextConfig` | `{}`   | Configuração do Next.js a retornar |

Retorna o mesmo objeto `nextConfig` recebido, após carregar o `.env` da raiz do monorepo.

## Como funciona

1. A partir do `process.cwd()`, sobe a árvore de diretórios até encontrar um `turbo.json`.
2. Carrega o arquivo `.env` desse diretório usando `dotenv` com `override: false`.
3. Retorna a `nextConfig` original sem modificações.
