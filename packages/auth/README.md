# @repo/auth

Pacote compartilhado de autenticação do monorepo, baseado em [Better Auth](https://better-auth.com). Usa o `@repo/db` para acesso ao banco de dados via Prisma.

## Estrutura

```
packages/auth/
├── auth.ts              # Instância do servidor (Better Auth + prismaAdapter + admin plugin)
├── client.ts            # Cliente React (hooks e métodos)
├── index.ts             # Exports públicos do pacote
├── seed.ts              # Criação do primeiro usuário admin
└── components/
    ├── AuthGuard.tsx    # Protege rotas autenticadas
    └── Unauthorized.tsx # Tela 403 (Ant Design)
```

> O schema Prisma e as migrations estão em `packages/db`. Consulte o [README do @repo/db](../db/README.md).

## Exports

| Caminho                 | Conteúdo                                                                |
| ----------------------- | ----------------------------------------------------------------------- |
| `@repo/auth`            | `auth`, tipos `Session` e `User`, `toNextJsHandler`, `seedFirstUser`    |
| `@repo/auth/client`     | `authClient`, `signIn`, `signUp`, `signOut`, `useSession`, `getSession` |
| `@repo/auth/components` | `AuthGuard`, `Unauthorized`                                             |

## Variáveis de ambiente

```env
BETTER_AUTH_SECRET="..."              # Chave secreta para assinar sessões
NEXT_PUBLIC_BETTER_AUTH_URL="..."     # URL base da API de autenticação (ex: http://localhost:3004)
DATABASE_URL="postgres://..."         # Herdado de @repo/db
ADMIN_USER="admin@exemplo.com"        # E-mail do primeiro usuário (seed)
ADMIN_PASS="senha-segura"             # Senha do primeiro usuário (seed)
```

## Primeiro usuário (seed)

O `apps/landing` executa `seed.ts` automaticamente nos scripts `predev` e `prestart`.
Se o banco estiver vazio e `ADMIN_USER`/`ADMIN_PASS` estiverem definidos, um usuário com `role: "admin"` é criado.

Casos de saída antecipada (sem criar usuário):

- `ADMIN_USER` ou `ADMIN_PASS` não definidos
- Já existe pelo menos um usuário no banco

Para rodar manualmente:

```bash
bun --env-file ../../.env ../../packages/auth/seed.ts
# ou, de dentro de packages/auth:
bun run seed
```

## Roles (plugin admin)

O plugin `admin` do Better Auth está habilitado com `defaultRole: "user"`. Isso significa:

- Cadastro via `/register` → `role: "user"`
- Usuário criado pelo seed → `role: "admin"`

O plugin também adiciona os campos `banned`, `banReason` e `banExpires` ao modelo `user`, e `impersonatedBy` ao modelo `session`.

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

## Tabelas gerenciadas

As tabelas abaixo são definidas no schema de `@repo/db`:

| Tabela         | Descrição                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------- |
| `user`         | Dados do usuário (`role`, `banned`, `banReason`, `banExpires` adicionados pelo plugin admin) |
| `session`      | Sessões ativas (`impersonatedBy` adicionado pelo plugin admin)                               |
| `account`      | Contas vinculadas (OAuth ou e-mail/senha)                                                    |
| `verification` | Tokens de verificação de e-mail                                                              |
