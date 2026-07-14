import { prisma } from "@repo/db";
import type { UserCreatedPayload } from "@repo/events";
import { verifySignatureAppRouter } from "@repo/mq";

async function handler(req: Request) {
  const { id } = (await req.json()) as UserCreatedPayload;

  await prisma.appUser.upsert({
    where: { id },
    create: { id },
    update: {},
  });

  return Response.json({ ok: true });
}

const isDev = process.env.NODE_ENV === "development";

type RouteHandler = (req: Request) => Promise<Response>;

export const POST: RouteHandler = isDev
  ? handler
  : verifySignatureAppRouter(handler);
