# @repo/events

Contratos compartilhados de eventos do monorepo.

## O que centraliza

- nomes dos eventos (constantes)
- payloads tipados de cada evento
- mapa tipado `EventPayloadMap`

## Estrutura

```txt
packages/events/
	events/
		user.created.ts
		file.added.ts
	index.ts
```

Cada arquivo em `events/*.ts` contém o contrato de um evento (constante + payload).
O `index.ts` agrega os exports e mantém o `EventPayloadMap`.

## Uso

```ts
import { USER_CREATED, type UserCreatedPayload } from "@repo/events";
```

Também é possível importar por subpath quando necessário:

```ts
import { USER_CREATED } from "@repo/events/events/user.created";
```

## Adicionando um novo evento

1. Crie `packages/events/events/<nome.do.evento>.ts`
2. Exporte constante e tipo do payload
3. Re-exporte no `packages/events/index.ts`
4. Inclua no `EventPayloadMap`

Exemplo:

```ts
// packages/events/events/order.created.ts
export const ORDER_CREATED = "order.created" as const;

export type OrderCreatedPayload = {
	id: string;
	createdAt: string;
};
```
