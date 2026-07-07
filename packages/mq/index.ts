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
 * Registra uma URL como subscriber de um tópico do QStash (idempotente).
 * Verifica se o endpoint já está registrado antes de adicionar.
 * Deve ser chamado no bootstrap da aplicação (ex: `instrumentation.ts`).
 */
export async function registerSubscriber(
  topic: string,
  url: string
): Promise<void> {
  const topics = await mq.topics.list();
  const existing = topics.find((t) => t.name === topic);
  if (existing?.endpoints?.some((e) => e.url === url)) return;
  await mq.topics.addEndpoints({ name: topic, endpoints: [{ url }] });
}
