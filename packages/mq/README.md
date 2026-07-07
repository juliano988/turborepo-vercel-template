# @repo/mq

Infraestrutura de mensageria assíncrona entre bounded contexts via [QStash](https://upstash.com/docs/qstash) (Upstash).

## O que faz

Expõe funções para publicar eventos em tópicos QStash e registrar subscribers. É um pacote de infraestrutura pura — não conhece nenhum evento ou domínio específico.

## Servidor de desenvolvimento

Requer [Docker](https://docs.docker.com/get-docker/). Da raiz do monorepo:

```bash
bun run mq:dev
```

Sobe o servidor QStash em `http://localhost:8080`. Configure o `.env` com as credenciais de teste:

```env
QSTASH_URL=http://localhost:8080
QSTASH_TOKEN=eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0=
QSTASH_CURRENT_SIGNING_KEY=sig_7kYjw48mhY7kAjqNGcy6cr29RJ6r
QSTASH_NEXT_SIGNING_KEY=sig_5ZB6DVzB1wjE8S6rZ7eenA8Pdnhs
```

O servidor é in-memory — todos os dados são resetados ao reiniciar o container.

## API

### `publish<T>(topic, payload)`

Publica um payload num tópico QStash. O publisher não conhece os subscribers.

```ts
import { publish } from "@repo/mq";

await publish("meu.evento", { id: "123" });
```

### `registerSubscriber(topic, url)`

Registra uma URL como subscriber de um tópico. Deve ser chamado no bootstrap da aplicação via `instrumentation.ts`.

```ts
import { registerSubscriber } from "@repo/mq";

await registerSubscriber("meu.evento", "https://meu-app.vercel.app/api/events/meu_evento");
```

### `verifySignatureAppRouter`

Middleware para App Router que valida a assinatura do QStash em produção.

```ts
import { verifySignatureAppRouter } from "@repo/mq";

export const POST = verifySignatureAppRouter(async (req) => {
  // handler seguro
});
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `QSTASH_URL` | URL do servidor QStash (`http://localhost:8080` em dev) |
| `QSTASH_TOKEN` | Token de autenticação |
| `QSTASH_CURRENT_SIGNING_KEY` | Chave para verificação de assinatura |
| `QSTASH_NEXT_SIGNING_KEY` | Chave de rotação para verificação de assinatura |
