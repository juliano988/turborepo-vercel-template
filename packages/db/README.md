# @repo/db

Pacote centralizado de banco de dados do monorepo. Gerencia o [Prisma Client](https://www.prisma.io) e o schema PostgreSQL compartilhado entre todos os apps e pacotes.

## Estrutura

```
packages/db/
├── index.ts             # PrismaClient singleton + re-exports de @prisma/client
├── package.json
├── tsconfig.json
└── prisma/
    └── schema.prisma    # Schema centralizado (tabelas de auth e futuras entidades)
```

## Exports

| Caminho | Conteúdo |
|---|---|
| `@repo/db` | `prisma` (singleton do PrismaClient) + todos os tipos gerados pelo Prisma |

## Variáveis de ambiente

```env
DATABASE_URL="postgres://..."   # Conexão PostgreSQL usada pelo Prisma
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

Edite [prisma/schema.prisma](prisma/schema.prisma) e rode novamente:

```bash
bun run db:dev
```

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

- Quando uma migration nova é adicionada, os arquivos em `prisma/migrations/` mudam → Turborepo detecta a mudança e invalida o cache do `@repo/db` → `build` e `postbuild` rodam → migration é aplicada no banco de produção.
- Se nenhum arquivo do pacote mudou, o Turbo usa o cache e não roda o build — o que é correto, pois não há migration nova para aplicar.

Para rodar manualmente (ex: primeiro setup ou emergência):

```bash
bun run db:migrate:deploy
```

## Uso nos pacotes e apps

### Importar o client

```ts
import { prisma } from "@repo/db";

const users = await prisma.user.findMany();
```

### Importar tipos gerados

```ts
import type { User, Session } from "@repo/db";
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

## Schema do banco

O Better Auth gerencia quatro tabelas automaticamente:

| Tabela | Descrição |
|---|---|
| `user` | Dados do usuário |
| `session` | Sessões ativas |
| `account` | Contas vinculadas (OAuth ou e-mail/senha) |
| `verification` | Tokens de verificação de e-mail |
