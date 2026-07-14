import { prisma } from "@repo/db";
import type { FileAddedPayload } from "@repo/events";
import { verifySignatureAppRouter } from "@repo/mq";

async function handler(req: Request) {
  const payload = (await req.json()) as FileAddedPayload;

  await prisma.adminFile.upsert({
    where: { id: payload.id },
    create: {
      id: payload.id,
      name: payload.name,
      sizeBytes: payload.size,
      mimeType: payload.mimeType,
      ownerId: payload.ownerId,
      blobUrl: payload.blobUrl,
      uploadedAt: new Date(payload.uploadedAt),
    },
    update: {
      name: payload.name,
      sizeBytes: payload.size,
      mimeType: payload.mimeType,
      ownerId: payload.ownerId,
      blobUrl: payload.blobUrl,
      uploadedAt: new Date(payload.uploadedAt),
    },
  });

  return Response.json({ ok: true });
}

const isDev = process.env.NODE_ENV === "development";

type RouteHandler = (req: Request) => Promise<Response>;

export const POST: RouteHandler = isDev
  ? handler
  : verifySignatureAppRouter(handler);
