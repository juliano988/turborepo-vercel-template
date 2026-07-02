# Turborepo Vercel Template


Template de monorepo full-stack pronto para produção, construído com [Turborepo](https://turbo.build/repo), [Next.js](https://nextjs.org/) e [Bun](https://bun.sh/).

A arquitetura segue os princípios do **Domain-Driven Design (DDD)**, onde cada aplicação representa um **contexto delimitado (Bounded Context)** com responsabilidade bem definida. Os pacotes internos em `packages/` atuam como a camada de infraestrutura e utilitários compartilhados entre os contextos.

> [!CAUTION]
> Se você acredita que Next.js é "só pra front-end" e/ou que a única forma de entregar sistemas é através de API REST, **esse template não é pra você.**

## Arquitetura DDD

```
┌─────────────────────────────────────────────────────┐
│                  Contexto Principal                  │
│   app/        Aplicação core do produto              │
└─────────────────────────────────────────────────────┘

Contextos de Suporte (Supporting Contexts)

┌──────────────┐  ┌──────────────┐
│   admin/     │  │  landing/    │
│  Backoffice  │  │  Marketing   │
└──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────┐
│                  Contexto Genérico                   │
│   docs/       Documentação técnica e de produto      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│            Camada Compartilhada (packages/)          │
│  auth · ui · env · eslint-config · prettier-config  │
│  typescript-config                                   │
└─────────────────────────────────────────────────────┘
```

### Contexto Principal

| App | Responsabilidade | Porta |
|---|---|---|
| `app/` | Núcleo do produto — funcionalidades centrais do negócio | 3001 |

### Contextos de Suporte

Dão suporte ao contexto principal, mas possuem ciclo de vida e deploy independentes:

| App | Responsabilidade | Porta |
|---|---|---|
| `admin/` | Backoffice — gestão interna e operações administrativas | 3002 |
| `landing/` | Marketing — apresentação do produto e conversão | 3000 |

### Contexto Genérico

| App | Responsabilidade | Porta |
|---|---|---|
| `docs/` | Documentação técnica e de produto (Fuma Docs) | 3003 |

### Camada Compartilhada (`packages/`)

Infraestrutura e utilitários reutilizados por todos os contextos:

```
packages/
    auth/               # Lógica de autenticação (Better Auth + Prisma)
    db/                 # PrismaClient singleton e schema centralizado
  env/                # Carregador de variáveis de ambiente do monorepo
  ui/                 # Componentes de UI (Ant Design, DaisyUI, Fuma Docs)
  eslint-config/      # Configurações ESLint reutilizáveis
  prettier-config/    # Configuração Prettier compartilhada
  typescript-config/  # Configurações TypeScript base
```

## Tecnologias
| Categoria | Tecnologia |
|---|---|
| Monorepo | Turborepo 2 |
| Framework | Next.js (App Router) |
| Runtime / Package Manager | Bun |
| Autenticação | Better Auth |
| Banco de dados | Prisma Postgres (PGlite local / Prisma Postgres em produção) |
| UI | Ant Design, DaisyUI, Tailwind CSS |
| Documentação | Fuma Docs |
| Linguagem | TypeScript |

## Pré-requisitos

- [Bun](https://bun.sh/) >= 1.3
- Node.js >= 18
- [Docker](https://docs.docker.com/get-docker/) (necessário para gerar migrations com `bun run db:migrate:new`)

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do monorepo:

```env
# URLs das aplicações
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3003

# Banco de dados (atualizado automaticamente por `bun run db:dev`)
DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=1&pgbouncer=true"

# Better Auth
BETTER_AUTH_SECRET=sua-chave-secreta
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Início rápido

```bash
# Instalar dependências
bun install

# Subir banco de dados
bun db:dev

# Rodar todos os apps em modo desenvolvimento
bun dev

# Build de produção de todos os apps
bun run build

# Lint em todos os pacotes
bun lint
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `bun run db:dev` | Sobe banco local (PGlite), aplica schema e abre Prisma Studio |
| `bun run db:migrate` | Sobe banco local e aplica schema (sem abrir o Studio) |
| `bun run db:migrate:new <nome>` | Gera arquivo de migration via container Docker temporário |
| `bun run db:studio` | Abre o Prisma Studio para o banco atual |
| `bun dev` | Inicia todos os apps em modo desenvolvimento |
| `bun run build` | Build de produção (com cache do Turbo) |
| `bun run start` | Inicia todos os apps em modo produção |
| `bun lint` | Executa ESLint em todo o monorepo |
| `bun format` | Formata todos os arquivos com Prettier |
| `bun run check-types` | Verifica tipos TypeScript em todos os pacotes |
| `bun run clean` | Remove artefatos de build (`.turbo`, `.next`, `dist`) |

## Deploy

O projeto é otimizado para deploy na [Vercel](https://vercel.com/). Cada app dentro de `apps/` pode ser implantado como um projeto Vercel independente, apontando para o mesmo repositório e definindo o diretório raiz correspondente (ex: `apps/landing`).

As migrations do banco de dados são aplicadas automaticamente durante o build via `postbuild` no pacote `@repo/db`: quando um arquivo de migration novo é commitado, o Turborepo invalida o cache do pacote e executa `prisma migrate deploy` antes de buildar os apps que dependem dele. Nenhuma configuração adicional no Build Command da Vercel é necessária.

### Preview deploy com URLs sincronizadas entre apps

Cada app executa `prebuild: bun ../../scripts/vercel-env.ts` antes do build na Vercel.

Esse script gera `.env.local` automaticamente em `preview` e `production` a partir de um arquivo `vercel-env.json` no diretorio do app.

Arquivos esperados:

- `apps/landing/vercel-env.json`
- `apps/app/vercel-env.json`
- `apps/admin/vercel-env.json`
- `apps/docs/vercel-env.json`

Formato:

```json
{
  "NEXT_PUBLIC_APP_URL": "turborepo-vercel-template-app",
  "NEXT_PUBLIC_ADMIN_URL": "turborepo-vercel-template-admin",
  "NEXT_PUBLIC_DOCS_URL": "turborepo-vercel-template-docs",
  "NEXT_PUBLIC_BETTER_AUTH_URL": "turborepo-vercel-template-landing"
}
```

Importante: os valores devem ser exatamente os nomes dos projetos na Vercel.

- `preview`: o script usa `VERCEL_BRANCH_URL` para gerar URLs por branch (ex: `project-git-feature-team.vercel.app`).
- `production`: o script gera `https://<project>.vercel.app`.

Se os nomes dos projetos na Vercel forem diferentes do exemplo acima, ajuste os 4 arquivos `vercel-env.json` para refletir seus nomes reais.

## Justificativas

### Infraestrutura como serviço gerenciado

Acoplar a infraestrutura a uma plataforma de serviços autogerenciáveis (como Vercel, MongoDB Atlas, etc.) simplifica drasticamente o trabalho operacional. Sem servidores para provisionar, sem pipelines de infra para manter — você foca no produto. Isso reduz custo operacional, elimina overhead de gestão e acelera o time-to-market.

### Next.js é um framework completo, não só front-end

Next.js entrega Server Components, Server Actions, API Routes, middleware, autenticação via cookies, streaming, cache granular e muito mais — tudo na mesma stack. Com ele você é plenamente capaz de construir sistemas de grande porte usando uma única linguagem, um único framework e um único pipeline de build e deploy. Não há necessidade de uma camada de API REST separada para a maioria dos casos.
