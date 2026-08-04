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

A estrutura interna segue os princípios da **Arquitetura Limpa**, separando domínio, casos de uso e infraestrutura:

```txt
apps/app/
  agregates/          # Entidades e Value Objects do domínio
    File/
      vo/             # Value Objects (FileId, FileName, FileSize…)
      repository/     # Interface do repositório (contrato)
      types/
    User/
      vo/             # Value Objects (UserId, ApiKey)
      repository/
      types/
  useCases/           # Casos de uso — regras de negócio da aplicação
    DeleteManyFilesUseCase/
    DownloadFileByNameUseCase/
    ListUserFilesUseCase/
    UploadManyFilesUseCase/
  repository/         # Implementações concretas dos repositórios (Prisma)
    File/
    User/
  app/                # Camada Next.js (rotas, Server Actions, componentes)
    functions/        # Server Actions que invocam os casos de uso
    api/              # Route Handlers (ex: download de arquivos)
    components/       # Componentes React do contexto
  events/             # Handlers de eventos recebidos via QStash
```

Cada **caso de uso** encapsula uma única operação de negócio, recebe suas dependências por injeção via construtor e é completamente agnóstico ao framework. As Server Actions em `app/functions/` são a cola entre o Next.js e os casos de uso — elas instanciam as dependências concretas e delegam a execução.

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

> [!IMPORTANT]
> **Não adicione** `NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ADMIN_URL` ou `NEXT_PUBLIC_DOCS_URL` no painel da Vercel. Essas variáveis são geradas automaticamente pelo script `vercel-env.ts` em cada build. Variáveis do portal sobrescrevem o valor gerado e resultarão em URLs incorretas (`DEPLOYMENT_NOT_FOUND`).
> [!IMPORTANT]
> Para o QStash funcionar nos preview deploys protegidos, **gere uma única chave** e replique **exatamente o mesmo valor** em todos os projetos Vercel do monorepo (`trvt-landing`, `trvt-app`, `trvt-admin` e `trvt-docs`) em dois lugares:
>
> 1. **Settings → Deployment Protection → Protection Bypass for Automation**
> 2. **Environment Variables** com o nome `VERCEL_AUTOMATION_BYPASS_SECRET`
>
> O valor configurado em Deployment Protection e na variável de ambiente deve ser idêntico em todos os apps. O `@repo/mq` envia esse valor no header `x-vercel-protection-bypass` para que o QStash consiga chamar rotas protegidas nos previews.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do monorepo:

```env
# URLs das aplicações (apenas para desenvolvimento local)
# Em produção e preview, geradas automaticamente pelo script vercel-env.ts — não definir no painel da Vercel.
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3003

# Banco de dados (atualizado automaticamente por `bun run db:dev`)
DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=1&pgbouncer=true"

# Better Auth
BETTER_AUTH_SECRET=sua-chave-secreta
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000  # apenas local — não definir no painel da Vercel

# Primeiro usuário (criado automaticamente no primeiro `bun dev` ou `bun start`)
ADMIN_USER=admin@exemplo.com
ADMIN_PASS=senha-segura

# QStash — servidor de dev local (bun run mq:dev)
# Em produção, substituir pelas chaves reais da Upstash
QSTASH_URL=http://localhost:8080
QSTASH_TOKEN=eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0=
QSTASH_CURRENT_SIGNING_KEY=sig_7kYjw48mhY7kAjqNGcy6cr29RJ6r
QSTASH_NEXT_SIGNING_KEY=sig_5ZB6DVzB1wjE8S6rZ7eenA8Pdnhs

# Vercel protection bypass para preview deploys
# Gere uma chave uma única vez e replique exatamente o mesmo valor
# em todos os projetos Vercel, tanto em Deployment Protection quanto
# na variável de ambiente VERCEL_AUTOMATION_BYPASS_SECRET.
# Localmente, esse valor só é necessário se você quiser simular chamadas
# para previews protegidos.
VERCEL_AUTOMATION_BYPASS_SECRET=seu-segredo-de-protection-bypass
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
| `bun run test:unit`             | Executa apenas os testes unitários do monorepo               |
| `bun run test:integration`      | Dispara testes de integração (gateado para preview Vercel)   |
| `bun run test`                  | Executa unitários + etapa de integração gateada              |
| `bun run build`                 | Build de produção (com cache do Turbo)                        |
| `bun run start`                 | Inicia todos os apps em modo produção                         |
| `bun run lint`                  | Executa ESLint em todo o monorepo                             |
| `bun run format`                | Formata todos os arquivos com Prettier                        |
| `bun run check-types`           | Verifica tipos TypeScript em todos os pacotes                 |
| `bun run clean`                 | Remove artefatos de build (`.turbo`, `.next`, `dist`)         |

## Estratégia de testes

O projeto combina duas estratégias, de acordo com o tipo de subdomínio:

### Subdomínios principais (Core): pirâmide de testes

Nos contextos principais de negócio (ex.: `apps/app`), usamos a **pirâmide de testes** para privilegiar velocidade, feedback rápido e segurança de regra de negócio:

1. **Base (maior volume): testes unitários**
  - Dominio (`agregates/vo`)
  - Casos de uso (`useCases/`)
  - Server Actions finas (`app/functions/`)
  - Repositórios com Prisma mockado (contrato/mapeamento)

2. **Meio (volume reduzido): integração real com banco**
  - Repositórios críticos do `apps/app/repository`
  - Execução contra `DATABASE_URL` real
  - Setup/cleanup por teste para isolamento

3. **Topo (menor volume): E2E**
  - Fluxos ponta a ponta (login, upload, listagem, download)
  - Deve ficar enxuto para manter custo e estabilidade

### Subdomínios de suporte: losango de testes

Nos subdomínios de suporte (ex.: `admin`, `landing`, integrações de plataforma e camadas transversais), usamos o **losango de testes**:

1. **Base moderada: unitários essenciais**
  - Regras locais e utilitários críticos

2. **Centro mais largo: integração e testes de contrato**
  - Integração entre app, banco, auth, mensageria e serviços externos
  - Maior foco em comportamento entre fronteiras do sistema
  - Registros ativos

3. **Topo moderado: E2E de jornada**
  - Menos volume que integração, mas mais presente que na pirâmide pura
  - Cobre caminhos de negócio e fluxos cross-app mais sensíveis

Em resumo: no **subdomínio principal** concentramos massa em unitário (pirâmide); nos **subdomínios de suporte** deslocamos mais esforço para integração/contrato (losango).

### Organização no `apps/app`

- Testes unitários usam `vitest.config.ts` e seguem o padrão `*.unit.spec.ts`.
- Testes de integração real usam `vitest.integration.config.ts` e seguem o padrão `*.integration.spec.ts`.

### Como os comandos funcionam

No root:

- `bun run test:unit` roda `turbo run test`.
- `bun run test:integration` chama `apps/app` com gate de preview.
- `bun run test` executa `test:unit` seguido de `test:integration`.

No `apps/app`:

- `test` roda apenas unitários.
- `test:integration` gera Prisma Client e roda a suíte de integração real.
- `test:integration:preview` só executa integração quando:
  - `VERCEL=1`
  - `VERCEL_ENV=preview`
  - `DATABASE_URL` está definido

Fora desse contexto, o comando faz skip explícito.

### Execução na Vercel Preview

No `apps/app`, o `postbuild` executa `test:integration:preview`.

Isso significa que:

1. Em Preview Deploy, os testes de integração real são executados após o build.
2. Em Production Deploy e ambiente local, essa etapa não roda (skip).

Essa estratégia mantém o pipeline simples e evita acoplar infraestrutura de desenvolvimento local no build remoto.

## Eventos entre bounded contexts (QStash)

A comunicação assíncrona entre contextos é feita via **QStash Topics**. Neste template, por decisão pragmática, o publisher informa explicitamente os subscribers no `publish` para garantir o registro dos endpoints antes do envio e evitar falhas de tópico inexistente.

### Subindo o servidor de dev

Requer [Docker](https://docs.docker.com/get-docker/):

```bash
bun run mq:dev
```

Sobe um servidor QStash local em `http://localhost:8080`. Use as credenciais de dev no `.env` (veja a seção [Variáveis de ambiente](#variáveis-de-ambiente)).

### Criando um evento

Os contratos de eventos ficam centralizados em `@repo/events` para evitar acoplamento direto entre contextos.

Convenção da package:

```txt
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
    await publish(MEU_EVENTO, payload, [
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/app/api/events/meu_evento`,
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/api/events/meu_evento`,
    ]);
  } catch (err) {
    console.error("[context] falha ao publicar meu.evento:", err);
  }
}
```

### Consumindo um evento

O subscriber expõe uma rota que o QStash chama. O endpoint deve estar na lista
de subscribers informada no `publish`.

**1. Implemente o handler** (`apps/<app>/app/api/events/meu_evento/route.ts`):

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

Cada app executa `prebuild: bun ../../scripts/vercel-env.ts` antes do build na Vercel. O script gera um `.env` com as URLs corretas de cada app — sem nenhuma configuração manual por ambiente.

Os nomes dos projetos Vercel são definidos centralmente em `packages/proxy/index.ts`:

```ts
export const apps = {
  landing: { vercelProject: "trvt-landing", envVar: "NEXT_PUBLIC_BETTER_AUTH_URL", ... },
  app:     { vercelProject: "trvt-app",     envVar: "NEXT_PUBLIC_APP_URL", ... },
  admin:   { vercelProject: "trvt-admin",   envVar: "NEXT_PUBLIC_ADMIN_URL", ... },
  docs:    { vercelProject: "trvt-docs",    envVar: "NEXT_PUBLIC_DOCS_URL", ... },
};
```

Se os nomes dos seus projetos na Vercel forem diferentes, ajuste os campos `vercelProject` nesse arquivo.

O script deriva as URLs de acordo com o ambiente:

- **`preview`**: usa `VERCEL_BRANCH_URL` para montar URLs por branch (ex: `trvt-app-git-minha-feature-meutime.vercel.app`).
- **`production`**: usa `VERCEL_PROJECT_PRODUCTION_URL` para extrair o sufixo de conta/time (ex: `-juliano988s-projects.vercel.app`) e aplicá-lo a todos os projetos. Isso garante funcionamento tanto em contas pessoais (`projeto-usuario-projects.vercel.app`) quanto em contas de time.

> [!IMPORTANT]
> **Não defina** `NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ADMIN_URL` ou `NEXT_PUBLIC_DOCS_URL` no painel da Vercel. Variáveis do portal têm precedência sobre o `.env` gerado pelo script e resultarão em URLs incorretas.
> [!NOTE]
> Se os preview deploys estiverem protegidos, gere uma única chave e replique exatamente o mesmo valor em todos os projetos Vercel do monorepo, tanto em **Settings → Deployment Protection → Protection Bypass for Automation** quanto na variável de ambiente `VERCEL_AUTOMATION_BYPASS_SECRET`. O `@repo/mq` usa esse segredo para chamar os handlers protegidos por preview.

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
