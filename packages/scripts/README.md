# @repo/scripts

Scripts de automação para o pipeline de build do monorepo na Vercel.

## `vercel-env.ts`

Gera o arquivo `.env` com as URLs corretas de cada app, derivando-as automaticamente de `VERCEL_BRANCH_URL`. Deve ser executado como script `prebuild` em cada app na Vercel.

### Comportamento por ambiente

| `VERCEL_ENV`  | Comportamento                                                                                |
| ------------- | -------------------------------------------------------------------------------------------- |
| `development` | Encerra sem fazer nada (usa o `.env` local)                                                  |
| `preview`     | Deriva as URLs do sufixo de `VERCEL_BRANCH_URL` (`[project]-git-[branch]-[team].vercel.app`) |
| `production`  | Gera URLs fixas no padrão `[project].vercel.app`                                             |

### Uso

**Sem argumentos** — lê os mapeamentos centrais de `@repo/proxy`:

```sh
bun ../../packages/scripts/vercel-env.ts
```

**Com argumentos** — sobrescreve os mapeamentos (formato `VAR=projeto-vercel`):

```sh
bun ../../packages/scripts/vercel-env.ts NEXT_PUBLIC_APP_URL=turborepo-vercel-template-app
```

### Configuração no `package.json` de cada app

```json
{
  "scripts": {
    "prebuild": "bun ../../packages/scripts/vercel-env.ts"
  }
}
```

### Variáveis de ambiente usadas

| Variável            | Origem | Descrição                                                                 |
| ------------------- | ------ | ------------------------------------------------------------------------- |
| `VERCEL_ENV`        | Vercel | `"production"`, `"preview"` ou `"development"`                            |
| `VERCEL_BRANCH_URL` | Vercel | URL da branch atual no formato `[project]-git-[branch]-[team].vercel.app` |

> Os nomes dos projetos Vercel e as variáveis de ambiente correspondentes são definidos centralmente em [`@repo/proxy`](../proxy/README.md).
