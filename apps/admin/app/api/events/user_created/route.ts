import type { UserCreatedPayload } from "@repo/auth";
import { prisma } from "@repo/db";
import { verifySignatureAppRouter } from "@repo/mq";

async function handler(req: Request) {
  const { id, name, email, emailVerified, createdAt, updatedAt, role } =
    (await req.json()) as UserCreatedPayload;

  await prisma.adminUser.upsert({
    where: { id },
    create: {
      id,
      name,
      email,
      emailVerified,
      createdAt,
      updatedAt,
      role: role ?? undefined,
    },
    update: {},
  });

  return Response.json({ ok: true });
}

const isDev = process.env.NODE_ENV === "development";

type RouteHandler = (req: Request) => Promise<Response>;

export const POST: RouteHandler = isDev
  ? handler
  : verifySignatureAppRouter(handler);
