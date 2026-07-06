# @repo/db

Pacote centralizado de banco de dados do monorepo. Gerencia o [Prisma Client](https://www.prisma.io) e o schema PostgreSQL compartilhado entre todos os apps e pacotes.

## Estrutura

```
packages/db/
├── index.ts             # PrismaClient singleton (adapter pg) + re-exports de @prisma/client
├── prisma.config.ts     # Configuração do Prisma 7 (schema path, datasource URL, migrations path)
├── package.json
├── tsconfig.json
└── prisma/
    ├── migrations/          # Arquivos SQL de migration (commitados no git)
    └── schema/              # Schemas Prisma por bounded context
        ├── base.prisma      # generator + datasource (schemas PostgreSQL declarados aqui)
        └── auth.prisma      # Modelos do contexto de autenticação (auth schema no PostgreSQL)
```

### Convenções de schema

Cada bounded context tem seu próprio arquivo `.prisma` e seu próprio schema PostgreSQL:

```prisma
// Prefixo no nome do modelo evita conflitos entre contextos
model AuthUser {
  // ...
  @@map("user")        // nome real da tabela no banco
  @@schema("auth")     // schema PostgreSQL: auth.user
}
```

O accessor no client Prisma é sempre baseado no **nome do modelo** (camelCase), não no schema:

```ts
prisma.authUser   // acessa auth.user no PostgreSQL
prisma.authSession // acessa auth.session
```

Para adicionar um novo bounded context:

1. Crie `prisma/schema/<contexto>.prisma` com os modelos e `@@schema("<contexto>")`
2. Adicione `"<contexto>"` ao array `schemas` no `base.prisma`
3. Rode `bun run db:migrate:new` para gerar a migration

## Exports

| Caminho | Conteúdo |
|---|---|
| `@repo/db` | `prisma` (singleton do PrismaClient) + todos os tipos gerados pelo Prisma |

## Variáveis de ambiente

```env
DATABASE_URL="postgres://..."        # Conexão PostgreSQL usada pelo Prisma (CLI e runtime)
SHADOW_DATABASE_URL="postgres://..." # Usada pelo prisma migrate dev (gerada automaticamente em dev)
```

## Setup inicial

### 1. Instalar dependências

```bash
bun install
```

### 2. Subir o banco local e aplicar o schema

```bash
bun run db:dev
```

Este comando (executado da raiz do monorepo):
1. Para qualquer instância anterior do banco (dados preservados)
2. Sobe um servidor PostgreSQL local via `prisma dev` (PGlite)
3. Atualiza o `DATABASE_URL` no `.env` com a URL correta
4. Aplica o schema com `prisma db push`
5. Abre o **Prisma Studio** em [http://localhost:5555](http://localhost:5555)

### 3. Alterar o schema

Para modificar um bounded context existente, edite o arquivo `.prisma` correspondente em `prisma/schema/` e rode:

```bash
bun run db:dev
```

Para **adicionar um novo bounded context**:
1. Crie `prisma/schema/<contexto>.prisma`
2. Declare os modelos com `@@schema("<contexto>")` e `@@map("<tabela>")`
3. Adicione `"<contexto>"` ao array `schemas` em `prisma/schema/base.prisma`
4. Rode `bun run db:dev` para aplicar localmente

> **Por que `db push` e não `migrate dev`?**  
> O `prisma dev` usa PGlite internamente, que suporta apenas **1 conexão simultânea**.  
> O `migrate dev` exige uma segunda conexão para o shadow database — por isso falha com `P1017`.  
> Para desenvolvimento local, `db push` é suficiente e não precisa de shadow database.

### Gerar migration files (localmente com Docker)

```bash
bun run db:migrate:new nome-da-feature
```

Este comando sobe um container PostgreSQL temporário, roda `prisma migrate dev` e remove o container ao final. O arquivo gerado em `prisma/migrations/` deve ser commitado no git.

**Pré-requisito:** Docker instalado e acessível sem `sudo`. Para liberar o acesso:

```bash
sudo usermod -aG docker $USER
newgrp docker   # aplica na sessão atual sem precisar relogar
```

### Deploy em produção / CI

As migrations são aplicadas automaticamente durante o build na Vercel via `postbuild`:

```
turbo run build
  └─ @repo/db#build
       ├─ prisma generate   (build)
       └─ prisma migrate deploy  (postbuild)
```

O fluxo funciona assim:

- Quando uma migration nova é adicionada, os arquivos em `prisma/migrations/` mudam → Turborepo detecta a mudança e invalida o cache do `@repo/db` → `build` e `postbuild` rodam → migration é aplicada no banco.
- Se nenhum arquivo do pacote mudou, o Turbo usa o cache e não roda o build — o que é correto, pois não há migration nova para aplicar.
- Em **preview deploys**, a integração Vercel+Neon injeta automaticamente a `DATABASE_URL` do branch Neon isolado — o `postbuild` aplica as migrations nesse banco sem nenhuma configuração extra.

Para rodar manualmente (ex: primeiro setup ou emergência):

```bash
bun run db:migrate:deploy
```

## Uso nos pacotes e apps

### Importar o client

```ts
import { prisma } from "@repo/db";

// Os accessors seguem o nome do modelo Prisma (camelCase), não o schema PostgreSQL
const users = await prisma.authUser.findMany();
const sessions = await prisma.authSession.findMany();
```

### Importar tipos gerados

```ts
import type { AuthUser, AuthSession } from "@repo/db";
```

## Relação com @repo/auth

O pacote `@repo/auth` (Better Auth) importa o `prisma` singleton deste pacote:

```ts
// packages/auth/auth.ts
import { prisma } from "@repo/db";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  // ...
});
```

## Uso nos apps Next.js

### Route handler (servidor)

Crie o arquivo `app/api/auth/[...all]/route.ts`:

```ts
import { auth, toNextJsHandler } from "@repo/auth";

export const { GET, POST } = toNextJsHandler(auth);
```

### Proteger uma página

```tsx
import { AuthGuard } from "@repo/auth/components";

export default function DashboardPage() {
  return (
    <AuthGuard loginUrl="/login">
      <p>Conteúdo protegido</p>
    </AuthGuard>
  );
}
```

### Hooks no client

```tsx
"use client";
import { useSession, signOut } from "@repo/auth/client";

export function Header() {
  const { data: session } = useSession();
  return <button onClick={() => signOut()}>Sair — {session?.user.name}</button>;
}
```
