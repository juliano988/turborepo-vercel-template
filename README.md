# Turborepo Vercel Template

Template de monorepo full-stack pronto para produção, construído com [Turborepo](https://turbo.build/repo), [Next.js](https://nextjs.org/) e [Bun](https://bun.sh/).

A arquitetura segue os princípios do **Domain-Driven Design (DDD)**, onde cada aplicação representa um **contexto delimitado (Bounded Context)** com responsabilidade bem definida. Os pacotes internos em `packages/` atuam como a camada de infraestrutura e utilitários compartilhados entre os contextos.

> [!CAUTION]
> Se você acredita que Next.js é "só pra front-end" e/ou que a única forma de entregar sistemas é através de API REST, **esse template não é pra você.**

> [!NOTE]
> Se ainda assim quiser manter um app dedicado exclusivamente a uma API — usando Express.js, Nest.js ou similar — fique à vontade para criar mais um contexto aqui (ex: `apps/api`). O Turborepo suporta isso sem nenhuma fricção. Mas avalie com cuidado: na maioria dos casos, isso é over-engineering. As API Routes e Server Actions do Next.js já cobrem o que um serviço de API separado faria, sem o custo operacional de mais um processo, mais um deploy e mais uma camada de rede entre o front e o back.

## Arquitetura DDD

```mermaid
graph TB
    subgraph CORE["Contexto Principal"]
        APP["app/\nCore do produto"]
    end

    subgraph SUPPORT["Contextos de Suporte"]
        ADMIN["admin/\nBackoffice"]
        LANDING["landing/\nMarketing"]
    end

    subgraph GENERIC["Contexto Genérico"]
        DOCS["docs/\nDocumentação"]
    end

    subgraph SHARED["packages/ · Contexto de Suporte — Camada Compartilhada"]
        direction LR
        AUTH[auth] --- DB[db] --- UI[ui] --- ENV[env] --- PROXY[proxy] --- SCRIPTS[scripts] --- CFG[configs]
    end

    APP --> SHARED
    ADMIN --> SHARED
    LANDING --> SHARED
    DOCS --> SHARED
```

> **Extensível por design:** o template foi pensado para crescer junto com o seu domínio. Novos contextos delimitados podem ser adicionados como novos apps em `apps/` — sejam contextos **principais**, de **suporte** ou **genéricos**. Basta criar o diretório, configurar o `package.json` e incluir a entrada correspondente no `turbo.json`. Cada contexto tem ciclo de vida e deploy independentes, compartilhando apenas a camada de `packages/`.

### Contexto Principal

| App    | Responsabilidade                                        | Porta |
| ------ | ------------------------------------------------------- | ----- |
| `app/` | Núcleo do produto — funcionalidades centrais do negócio | 3001  |

### Contextos de Suporte

Dão suporte ao contexto principal, mas possuem ciclo de vida e deploy independentes:

| App        | Responsabilidade                                        | Porta |
| ---------- | ------------------------------------------------------- | ----- |
| `admin/`   | Backoffice — gestão interna e operações administrativas | 3002  |
| `landing/` | Marketing — apresentação do produto e conversão         | 3000  |

### Contexto Genérico

| App     | Responsabilidade                              | Porta |
| ------- | --------------------------------------------- | ----- |
| `docs/` | Documentação técnica e de produto (Fuma Docs) | 3003  |

### Camada Compartilhada (`packages/`)

Infraestrutura e utilitários reutilizados por todos os contextos:

| Pacote               | Descrição                                                            |
| -------------------- | -------------------------------------------------------------------- |
| `auth/`              | Lógica de autenticação (Better Auth + Prisma)                        |
| `db/`                | PrismaClient singleton e schemas por bounded context                 |
| `mq/`                | Mensageria assíncrona entre bounded contexts (QStash)                |
| `events/`            | Contratos compartilhados de eventos entre bounded contexts           |
| `env/`               | Carregador de variáveis de ambiente do monorepo                      |
| `ui/`                | Componentes de UI (Ant Design, DaisyUI, Fuma Docs)                   |
| `proxy/`             | Configuração do proxy reverso entre apps                             |
| `scripts/`           | Scripts utilitários do monorepo (ex: sincronização de env na Vercel) |
| `eslint-config/`     | Configurações ESLint reutilizáveis                                   |
| `prettier-config/`   | Configuração Prettier compartilhada                                  |
| `typescript-config/` | Configurações TypeScript base                                        |

## Visão rápida de cada projeto

### `apps/app` (Core)

Aplicação principal do produto. É onde vivem os fluxos centrais de negócio e as features que representam o domínio principal do sistema.

### `apps/admin` (Backoffice)

Painel administrativo para operação interna. Reúne funcionalidades de gestão, suporte e manutenção do produto sem acoplamento direto à experiência do usuário final.

### `apps/landing` (Marketing)

Aplicação focada em aquisição e conversão. Centraliza páginas institucionais, conteúdo comercial e fluxos de entrada como login/cadastro.

No template, o `landing` atua como **âncora do projeto**: é ele que hospeda as rotas de autenticação (`/login`, `/register`) e o proxy reverso que roteia requisições entre os demais apps. Essa escolha é intencional — a landing costuma ser o ponto de entrada público do sistema, tornando-a o lugar natural para essas responsabilidades.

> **Não precisa de landing page?** Sem problema. A lógica de autenticação (`@repo/auth`) e de proxy (`@repo/proxy`) vivem nos packages e são completamente desacopladas deste app. Basta mover as rotas de auth e a configuração de proxy para qualquer outro contexto do monorepo — como o próprio `app/` — e remover ou repurposear o `landing`.

### `apps/docs` (Documentação)

Portal de documentação técnica e de produto (Fuma Docs). Serve para onboarding, guias de uso, referência e conteúdo para times internos e externos.

## Tecnologias

| Categoria                 | Tecnologia                                        |
| ------------------------- | ------------------------------------------------- |
| Monorepo                  | Turborepo 2                                       |
| Framework                 | Next.js (App Router)                              |
| Runtime / Package Manager | Bun                                               |
| Autenticação              | Better Auth                                       |
| Banco de dados            | Prisma 7 + Neon (PGlite local / Neon em produção) |
| Mensageria                | QStash (Upstash)                                  |
| UI                        | Ant Design, DaisyUI, Tailwind CSS                 |
| Documentação              | Fuma Docs                                         |
| Linguagem                 | TypeScript                                        |

## Pré-requisitos

- [Bun](https://bun.sh/) >= 1.3
- Node.js >= 18
- [Docker](https://docs.docker.com/get-docker/) (necessário para gerar migrations com `bun run db:migrate:new` e para o servidor QStash local com `bun run mq:dev`)

### Recursos na Vercel (produção)

Antes do primeiro deploy, crie os três recursos abaixo no painel da Vercel e conecte-os a todos os projetos do monorepo via **Storage → Connect to Project**:

| Recurso            | Tipo                           | Uso                        |
| ------------------ | ------------------------------ | -------------------------- |
| **Neon Postgres**  | Neon — Free                    | Banco de dados principal   |
| **Vercel Blob**    | Blob Store                     | Armazenamento de arquivos  |
| **Upstash QStash** | Upstash QStash/Workflow — Free | Mensageria entre contextos |

Cada recurso injeta automaticamente suas variáveis de ambiente nos projetos conectados (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `QSTASH_TOKEN`, etc.) — sem configuração manual.

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

# Primeiro usuário (criado automaticamente no primeiro `bun dev` ou `bun start`)
ADMIN_USER=admin@exemplo.com
ADMIN_PASS=senha-segura

# QStash — servidor de dev local (bun run mq:dev)
# Em produção, substituir pelas chaves reais da Upstash
QSTASH_URL=http://localhost:8080
QSTASH_TOKEN=eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0=
QSTASH_CURRENT_SIGNING_KEY=sig_7kYjw48mhY7kAjqNGcy6cr29RJ6r
QSTASH_NEXT_SIGNING_KEY=sig_5ZB6DVzB1wjE8S6rZ7eenA8Pdnhs
```

## Início rápido

```bash
# Instalar dependências
bun install

# Subir banco de dados
bun run db:dev

# Subir servidor de fila (QStash local) — em outro terminal
bun run mq:dev

# Rodar todos os apps em modo desenvolvimento
bun run dev

# Lint em todos os pacotes
bun run lint
```

## Scripts disponíveis

| Comando                         | Descrição                                                     |
| ------------------------------- | ------------------------------------------------------------- |
| `bun run db:dev`                | Sobe banco local (PGlite), aplica schema e abre Prisma Studio |
| `bun run db:migrate`            | Sobe banco local e aplica schema (sem abrir o Studio)         |
| `bun run db:migrate:new <nome>` | Gera arquivo de migration via container Docker temporário     |
| `bun run db:studio`             | Abre o Prisma Studio para o banco atual                       |
| `bun run mq:dev`                | Sobe o servidor QStash local via Docker (porta 8080)          |
| `bun run dev`                   | Inicia todos os apps em modo desenvolvimento                  |
| `bun run build`                 | Build de produção (com cache do Turbo)                        |
| `bun run start`                 | Inicia todos os apps em modo produção                         |
| `bun run lint`                  | Executa ESLint em todo o monorepo                             |
| `bun run format`                | Formata todos os arquivos com Prettier                        |
| `bun run check-types`           | Verifica tipos TypeScript em todos os pacotes                 |
| `bun run clean`                 | Remove artefatos de build (`.turbo`, `.next`, `dist`)         |

## Eventos entre bounded contexts (QStash)

A comunicação assíncrona entre contextos é feita via **QStash Topics** — um modelo pub/sub onde o publisher conhece apenas o nome do tópico, nunca os subscribers.

### Subindo o servidor de dev

Requer [Docker](https://docs.docker.com/get-docker/):

```bash
bun run mq:dev
```

Sobe um servidor QStash local em `http://localhost:8080`. Use as credenciais de dev no `.env` (veja a seção [Variáveis de ambiente](#variáveis-de-ambiente)).

### Criando um evento

Os contratos de eventos ficam centralizados em `@repo/events` para evitar acoplamento direto entre contextos.

Convenção da package:

```
packages/events/
  events/
    user.created.ts
    file.added.ts
  index.ts
```

Cada arquivo em `packages/events/events/*.ts` deve conter:

- constante do tópico (`as const`)
- tipo do payload do evento

Exemplo (`packages/events/events/meu.evento.ts`):

```ts
export const MEU_EVENTO = "meu.evento" as const;

export type MeuEventoPayload = {
  id: string;
  // ...
};
```

No agregador (`packages/events/index.ts`), re-exporte os eventos e mantenha o mapa tipado:

```ts
import { MEU_EVENTO } from "./events/meu.evento";
import type { MeuEventoPayload } from "./events/meu.evento";

export { MEU_EVENTO };
export type { MeuEventoPayload };

export type EventPayloadMap = {
  [MEU_EVENTO]: MeuEventoPayload;
};

export type EventName = keyof EventPayloadMap;
```

### Publicando um evento

No contexto publisher (app ou package), importe contrato e constante de `@repo/events`:

```ts
import { publish } from "@repo/mq";
import { MEU_EVENTO, type MeuEventoPayload } from "@repo/events";

export default async function createMeuEvento(payload: MeuEventoPayload) {
  try {
    await publish(MEU_EVENTO, payload);
  } catch (err) {
    console.error("[context] falha ao publicar meu.evento:", err);
  }
}
```

### Consumindo um evento

O subscriber se auto-registra no tópico via `instrumentation.ts` e expõe uma rota que o QStash chama:

**1. Registre o subscriber** (`apps/<app>/instrumentation.ts`):

```ts
import { registerSubscriber } from "@repo/mq";
import { MEU_EVENTO } from "@repo/events";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  await registerSubscriber(
    MEU_EVENTO,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events/meu_evento`
  );
}
```

**2. Implemente o handler** (`apps/<app>/app/api/events/meu_evento/route.ts`):

```ts
import { verifySignatureAppRouter } from "@repo/mq";
import type { MeuEventoPayload } from "@repo/events";

async function handler(req: Request) {
  const payload = (await req.json()) as MeuEventoPayload;
  // ... processar o evento
  return Response.json({ ok: true });
}

const isDev = process.env.NODE_ENV === "development";
export const POST = isDev ? handler : verifySignatureAppRouter(handler);
```

> Em dev, a verificação de assinatura é desabilitada pois o servidor local usa chaves fixas. Em produção, `verifySignatureAppRouter` valida a assinatura do QStash automaticamente.

## Banco de dados e migrations

### Desenvolvimento

Em dev, o banco roda localmente via **PGlite** (Postgres embarcado, sem Docker). O comando `bun run db:dev` sobe o banco, aplica o schema atual e abre o Prisma Studio. Não há migrations geradas automaticamente nesse fluxo — o schema é aplicado diretamente com `prisma db push`.

Para **criar uma migration** (necessário antes de subir para produção), use:

```bash
bun run db:migrate:new <nome-da-migration>
```

Esse comando sobe um container Docker temporário com Postgres, gera o arquivo de migration em `packages/db/prisma/migrations/` e encerra o container. O Docker é necessário apenas nesse passo — o restante do desenvolvimento não depende dele.

### Produção

Em produção, o banco utilizado é o **[Neon](https://neon.tech/)** — um Postgres serverless totalmente gerenciado, com branching nativo que habilita ambientes de preview isolados por pull request sem nenhuma configuração adicional.

**Configuração necessária antes do primeiro deploy:**

1. No painel da Vercel, acesse o projeto e vá em **Storage → Create Database → Neon**
2. A `DATABASE_URL` é adicionada automaticamente como variável de ambiente nos ambientes `production` e `preview`
3. Para os demais projetos do monorepo, compartilhe o banco via **Storage → Connect to Project** no painel da Vercel
4. No [console do Neon](https://console.neon.tech/), acesse o projeto criado e vá em **Integrations → GitHub** — conecte sua conta e repositório para que o Neon crie automaticamente os secrets `NEON_API_KEY` e `NEON_PROJECT_ID` no GitHub; isso habilita o branching automático do banco a cada pull request

As migrations são então aplicadas **automaticamente durante o build na Vercel**. O pacote `@repo/db` possui um script `postbuild` que executa `prisma migrate deploy` antes de qualquer app ser buildado. Como o Turborepo cacheia os outputs por conteúdo, um novo arquivo de migration invalida o cache do pacote `db`, forçando a re-execução do `postbuild` — e consequentemente o rebuild de todos os apps que dependem dele. Nenhuma configuração adicional no pipeline da Vercel é necessária.

O branching do Neon também funciona automaticamente para previews: cada pull request recebe um banco de dados isolado (criado e deletado pela própria integração), e a `DATABASE_URL` correta é injetada no preview deploy correspondente — sem nenhuma configuração extra.

## Deploy

O projeto é otimizado para deploy na [Vercel](https://vercel.com/). Cada app dentro de `apps/` pode ser implantado como um projeto Vercel independente, apontando para o mesmo repositório e definindo o diretório raiz correspondente (ex: `apps/landing`). O banco de dados, migrations e variáveis de ambiente são compartilhados entre os projetos — veja as seções [Banco de dados e migrations](#banco-de-dados-e-migrations) e [Variáveis de ambiente](#variáveis-de-ambiente) para os detalhes..

### Preview deploy com URLs sincronizadas entre apps

Cada app executa `prebuild: bun ../../scripts/vercel-env.ts` antes do build na Vercel.

Esse script gera `.env` automaticamente em `preview` e `production` a partir de um arquivo `vercel-env.json` no diretorio do app.

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

## Pipeline CI/CD sugerido

```mermaid
graph LR
    A[1. Criar branch\nde feature] --> B[2. Abrir\nPull Request]
    B --> C[3. Preview deploy\nautomático]
    C --> D[4. Testar\no preview]
    D --> E[5. Merge para main\ne deletar branch]
    E --> F[Deploy em\nprodução]
```

### Fluxo passo a passo

1. **Crie uma branch de feature** a partir da `main`
2. **Desenvolva a feature** — se houver mudanças no schema, gere a migration com `bun run db:migrate:new <nome>`
3. **Abra um Pull Request** — automaticamente:
   - A integração Neon cria um branch de banco de dados isolado para o PR
   - A Vercel gera um preview deploy com a `DATABASE_URL` desse branch injetada
   - O `postbuild` aplica as migrations no banco de preview durante o build
4. **Teste o preview deploy** — ambiente completamente isolado, sem risco ao banco de produção
5. **Mescle o PR para `main`** e delete a branch de feature:
   - O deploy de produção é disparado automaticamente na Vercel
   - As migrations são aplicadas no banco principal
   - O branch Neon do PR é deletado automaticamente pela integração

## Justificativas

### Infraestrutura como serviço gerenciado

Acoplar a infraestrutura a uma plataforma de serviços autogerenciáveis (como Vercel, MongoDB Atlas, etc.) simplifica drasticamente o trabalho operacional. Sem servidores para provisionar, sem pipelines de infra para manter — você foca no produto. Isso reduz custo operacional, elimina overhead de gestão e acelera o time-to-market.

### Prisma + Postgres como stack de banco de dados

Prisma com Postgres foi escolhido por ser uma das stacks mais consolidadas do ecossistema Node.js/TypeScript — amplamente documentada, com grande adoção na comunidade e suporte de primeira classe a migrations, type safety e ORM. O tradeoff é que o setup inicial é um pouco mais complexo: requer provisionar o banco, configurar a `DATABASE_URL` e gerenciar migrations explicitamente (o que já foi resolvido nesse template).

Dito isso, **o template não te prende a essa escolha**. Se o seu domínio se encaixa melhor em um banco de documentos, fique à vontade para usar [MongoDB](https://www.mongodb.com/) com [Mongoose](https://mongoosejs.com/) ou o próprio [Prisma com MongoDB](https://www.prisma.io/docs/orm/overview/databases/mongodb). O setup é consideravelmente mais simples — basta uma connection string e você já está operacional, sem migrations para gerenciar. Troque o pacote `@repo/db` pelo cliente de sua preferência e o restante do monorepo continua funcionando normalmente.

### Um banco por bounded context seria over-engineering

Criar um banco de dados separado para cada bounded context traz isolamento total, mas a um custo desproporcional para a maioria dos projetos: queries entre contextos exigem chamadas de rede, transações distribuídas se tornam complexas, e a infraestrutura se multiplica (conexões, backups, custos). Separar por **schema PostgreSQL** é o meio-termo certo — cada contexto tem seu próprio namespace isolado (`auth.user`, `storage.file`, etc.), sem nenhum dessas desvantagens. Essa é a estratégia adotada no pacote `@repo/db`.

### Next.js é um framework completo, não só front-end

Next.js entrega Server Components, Server Actions, API Routes, middleware, autenticação via cookies, streaming, cache granular e muito mais — tudo na mesma stack. Com ele você é plenamente capaz de construir sistemas de grande porte usando uma única linguagem, um único framework e um único pipeline de build e deploy. Não há necessidade de uma camada de API REST separada para a maioria dos casos.

### Estratégia de UI por contexto

A escolha da biblioteca de UI não é uniforme — ela varia de acordo com as necessidades de cada contexto:

**DaisyUI** (usado no `landing`) é uma biblioteca de componentes puramente CSS construída sobre Tailwind. Não adiciona nenhum JavaScript ao bundle, o que a torna ideal para páginas públicas onde performance de carregamento e SEO são críticos. Menos JS significa menos trabalho para o crawler, menor LCP e melhor Core Web Vitals. O Tailwind como base ainda permite customizações rápidas e consistentes sem sair do HTML.

**Ant Design** (usado no `app` e `admin`) é uma biblioteca rica em componentes interativos, adequada para interfaces administrativas e dashboards onde a experiência do usuário autenticado importa mais do que métricas de SEO. O custo de bundle é aceitável nesses contextos porque as páginas são protegidas por autenticação e não são indexadas por buscadores. Além disso, o ecossistema do Ant Design — especialmente via [Ant Design Charts](https://charts.ant.design/) e a `Table` nativa com ordenação, filtros e paginação embutidos — mitiga a necessidade de adicionar libs externas para gráficos, tabelas avançadas, formulários complexos e outros componentes típicos de backoffices, reduzindo a fragmentação de dependências no projeto.
