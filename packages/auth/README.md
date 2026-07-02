# @repo/auth

Pacote compartilhado de autenticação do monorepo, baseado em [Better Auth](https://better-auth.com). Usa o `@repo/db` para acesso ao banco de dados via Prisma.

## Estrutura

```
packages/auth/
├── auth.ts              # Instância do servidor (Better Auth + prismaAdapter)
├── client.ts            # Cliente React (hooks e métodos)
├── index.ts             # Exports públicos do pacote
└── components/
    ├── AuthGuard.tsx    # Protege rotas autenticadas
    └── Unauthorized.tsx # Tela 403 (Ant Design)
```

> O schema Prisma e as migrations estão em `packages/db`. Consulte o [README do @repo/db](../db/README.md).

## Exports

| Caminho | Conteúdo |
|---|---|
| `@repo/auth` | `auth`, tipos `Session` e `User`, `toNextJsHandler` |
| `@repo/auth/client` | `authClient`, `signIn`, `signUp`, `signOut`, `useSession`, `getSession` |
| `@repo/auth/components` | `AuthGuard`, `Unauthorized` |

## Variáveis de ambiente

```env
BETTER_AUTH_SECRET="..."              # Chave secreta para assinar sessões
NEXT_PUBLIC_BETTER_AUTH_URL="..."     # URL base da API de autenticação (ex: http://localhost:3004)
DATABASE_URL="postgres://..."         # Herdado de @repo/db
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

## Tabelas gerenciadas

As tabelas abaixo são definidas no schema de `@repo/db`:

| Tabela | Descrição |
|---|---|
| `user` | Dados do usuário |
| `session` | Sessões ativas |
| `account` | Contas vinculadas (OAuth ou e-mail/senha) |
| `verification` | Tokens de verificação de e-mail |
