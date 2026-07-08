import type { UserCreatedPayload } from "@repo/auth";
import { prisma } from "@repo/db";
import { verifySignatureAppRouter } from "@repo/mq";

async function handler(req: Request) {
  const { id } = (await req.json()) as UserCreatedPayload;

  await prisma.user.upsert({
    where: { id },
    create: { id },
    update: {},
  });

  return Response.json({ ok: true });
}

const isDev = process.env.NODE_ENV === "development";

export const POST = isDev ? handler : verifySignatureAppRouter(handler);
