import { Client } from "@upstash/qstash";

export type { PublishRequest } from "@upstash/qstash";
export { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export const mq = new Client({
  baseUrl: process.env.QSTASH_URL!,
  token: process.env.QSTASH_TOKEN!,
});

/**
 * Publica um evento num tópico do QStash.
 * O publisher não conhece os subscribers — eles se registram no tópico
 * via dashboard ou script de bootstrap.
 */
export async function publish<T>(topic: string, payload: T): Promise<void> {
  await mq.publishJSON({ topic, body: payload });
}

/**
 * Registra uma URL como subscriber de um tópico do QStash.
 * Deve ser chamado no bootstrap da aplicação (ex: `instrumentation.ts`).
 * Em desenvolvimento, o QStash não consegue alcançar localhost — use apenas em produção.
 */
export async function registerSubscriber(
  topic: string,
  url: string
): Promise<void> {
  await mq.topics.addEndpoints({ name: topic, endpoints: [{ url }] });
}
