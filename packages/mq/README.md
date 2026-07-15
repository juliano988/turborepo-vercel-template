# @repo/mq

Infraestrutura de mensageria assíncrona entre bounded contexts via [QStash](https://upstash.com/docs/qstash) (Upstash).

## O que faz

Expõe funções para publicar eventos em tópicos QStash e validar assinatura de webhooks do QStash. É um pacote de infraestrutura pura — não conhece nenhum evento ou domínio específico.

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

### `publish<T>(topic, payload, subscribers)`

Publica um payload num tópico QStash.

O publisher deve informar explicitamente os subscribers para o tópico, e o
método garante o registro dos endpoints antes de publicar.

> [!WARNING]
> Essa decisão não é a ideal sob a ótica de DDD, porque aumenta o acoplamento
> do publisher com detalhes de infraestrutura e com quem consome o evento.
> Ainda assim, foi adotada como solução pragmática para reduzir falhas
> operacionais, evitando bugs de tópico inexistente em ambientes de
> build/bootstrap.

```ts
import { publish } from "@repo/mq";

await publish("meu.evento", { id: "123" }, [
  "https://minha-app.com/api/events/meu_evento",
]);
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

| Variável                     | Descrição                                               |
| ---------------------------- | ------------------------------------------------------- |
| `QSTASH_URL`                 | URL do servidor QStash (`http://localhost:8080` em dev) |
| `QSTASH_TOKEN`               | Token de autenticação                                   |
| `QSTASH_CURRENT_SIGNING_KEY` | Chave para verificação de assinatura                    |
| `QSTASH_NEXT_SIGNING_KEY`    | Chave de rotação para verificação de assinatura         |
