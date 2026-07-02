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

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Contextos de Suporte (Supporting Contexts)        │
│   auth/      │  │   admin/     │  │  landing/    │
│  Identidade  │  │  Backoffice  │  │  Marketing   │
└──────────────┘  └──────────────┘  └──────────────┘

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
| `auth/` | Identidade e acesso — login, registro, sessão | 3002 |
| `admin/` | Backoffice — gestão interna e operações administrativas | 3003 |
| `landing/` | Marketing — apresentação do produto e conversão | 3000 |

> [!WARNING]
> **`auth/` pode ser overengineering para o seu caso.**
>
> Um app dedicado exclusivamente à autenticação agrega complexidade e só se justifica em cenários específicos. Avalie antes de sair do padrão:
>
> **Quando faz sentido mantê-lo:**
> - Múltiplos apps (`app/`, `admin/`, etc.) precisam redirecionar para um único ponto de login (fluxo SSO-like)
> - A lógica de identidade é complexa o suficiente para merecer um contexto isolado
>
> **Quando remover ou simplificar:**
> - Seu produto não precisa de autenticação → remova o app `auth/` inteiro
> - Prefere manter tudo no mesmo lugar → implemente o fluxo de login diretamente no `app/` ou em qualquer outro app
>
> Em ambos os casos, o pacote `packages/auth` (Better Auth + MongoDB) pode ser usado de forma independente, sem depender do app `auth/`.

### Contexto Genérico

| App | Responsabilidade | Porta |
|---|---|---|
| `docs/` | Documentação técnica e de produto (Fuma Docs) | 3004 |

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

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do monorepo:

```env
# URLs das aplicações
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3003
NEXT_PUBLIC_AUTH_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3004

# Banco de dados (atualizado automaticamente por `bun run db:dev`)
DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=1&pgbouncer=true"

# Better Auth
BETTER_AUTH_SECRET=sua-chave-secreta
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3002
```

## Início rápido

```bash
# Instalar dependências
bun install

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

## Justificativas

### Infraestrutura como serviço gerenciado

Acoplar a infraestrutura a uma plataforma de serviços autogerenciáveis (como Vercel, MongoDB Atlas, etc.) simplifica drasticamente o trabalho operacional. Sem servidores para provisionar, sem pipelines de infra para manter — você foca no produto. Isso reduz custo operacional, elimina overhead de gestão e acelera o time-to-market.

### Next.js é um framework completo, não só front-end

Next.js entrega Server Components, Server Actions, API Routes, middleware, autenticação via cookies, streaming, cache granular e muito mais — tudo na mesma stack. Com ele você é plenamente capaz de construir sistemas de grande porte usando uma única linguagem, um único framework e um único pipeline de build e deploy. Não há necessidade de uma camada de API REST separada para a maioria dos casos.
