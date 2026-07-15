import { Client } from "@upstash/qstash";

export type { PublishRequest } from "@upstash/qstash";
export { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export const mq = new Client({
  token: process.env.QSTASH_TOKEN!,
  headers: {
    "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
  },
});

/**
 * Garante que um tópico tenha todos os subscribers informados.
 *
 * O método é idempotente: apenas endpoints ausentes são adicionados.
 * Endpoints duplicados na entrada são normalizados automaticamente.
 *
 * @param topic Nome do tópico no QStash.
 * @param subscribers Lista de URLs que devem estar inscritas no tópico.
 */
async function ensureTopicSubscribers(
  topic: string,
  subscribers: string[]
): Promise<void> {
  const endpoints = Array.from(new Set(subscribers)).map((url) => ({ url }));

  const topics = await mq.topics.list();
  const existing = topics.find((t) => t.name === topic);
  const missingEndpoints = endpoints.filter(
    (endpoint) => !existing?.endpoints?.some((e) => e.url === endpoint.url)
  );

  if (missingEndpoints.length === 0) return;
  await mq.topics.addEndpoints({ name: topic, endpoints: missingEndpoints });
}

/**
 * Publica um evento num tópico do QStash.
 * O publisher deve informar explicitamente os subscribers do tópico.
 * O método garante o registro dos endpoints antes da publicação.
 *
 * Atenção: esta abordagem não é a ideal sob a ótica de DDD, pois aumenta
 * o acoplamento do publisher com detalhes de infraestrutura e consumidores.
 * Ainda assim, foi adotada para evitar bugs de tópico inexistente em
 * cenários de build/bootstrap.
 *
 * @param topic Nome do tópico no QStash.
 * @param payload Payload serializável do evento.
 * @param subscribers Lista de URLs subscribers obrigatórios para o tópico.
 * @throws Error Quando nenhum subscriber é informado.
 */
export async function publish<T>(
  topic: string,
  payload: T,
  subscribers: string[]
): Promise<void> {
  if (subscribers.length === 0) {
    throw new Error(`publish exige ao menos um subscriber para o tópico '${topic}'`);
  }

  await ensureTopicSubscribers(topic, subscribers);
  await mq.publishJSON({ topic, body: payload });
}
