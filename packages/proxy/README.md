# @repo/proxy

Fonte única de verdade para roteamento do monorepo. Centraliza a configuração de `basePath`, variáveis de ambiente e nomes de projetos Vercel de cada sub-app.

## Apps registrados

| App       | `basePath` | Env var                       | Projeto Vercel                          |
| --------- | ---------- | ----------------------------- | --------------------------------------- |
| `landing` | `/`        | `NEXT_PUBLIC_BETTER_AUTH_URL` | `turborepo-vercel-template-landing`     |
| `app`     | `/app`     | `NEXT_PUBLIC_APP_URL`         | `turborepo-vercel-template-app`         |
| `admin`   | `/admin`   | `NEXT_PUBLIC_ADMIN_URL`       | `turborepo-vercel-template-admin`       |
| `docs`    | `/docs`    | `NEXT_PUBLIC_DOCS_URL`        | `turborepo-vercel-template-docs`        |

## API

### `withBasePath(app, nextConfig?)`

Injeta o `basePath` correto na config do Next.js de um sub-app.

```ts
// apps/app/next.config.js
import { withBasePath } from '@repo/proxy';
export default withBasePath('app');
```

### `getProxyRewrites()`

Gera as regras de rewrite para o app `landing` redirecionar requisições para cada sub-app. Lê as URLs de `process.env` com base na configuração central.

```ts
// apps/landing/next.config.js
import { withEnv } from '@repo/env';
import { getProxyRewrites } from '@repo/proxy';
export default withEnv({
  async rewrites() {
    return getProxyRewrites();
  },
});
```

### `apps`

Objeto com a configuração completa de todos os apps. Use para referenciar `basePath`, `envVar` ou `vercelProject` sem hardcode.

```ts
import { apps } from '@repo/proxy';
console.log(apps.admin.basePath); // '/admin'
```

## Como adicionar um novo sub-app

1. Inclua uma entrada no objeto `apps` em [index.ts](./index.ts).
2. Adicione a env var correspondente no `.env` raiz e no `turbo.json`.
3. No `next.config.js` do novo app, use `withBasePath('meu-app')`.
