# @repo/events

Contratos compartilhados de eventos do monorepo.

## O que centraliza

- nomes dos eventos (constantes)
- payloads tipados de cada evento
- mapa tipado `EventPayloadMap`

## Uso

```ts
import { USER_CREATED, type UserCreatedPayload } from "@repo/events";
```
