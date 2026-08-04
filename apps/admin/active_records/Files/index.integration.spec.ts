import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "@repo/db";
import { File } from ".";

const createdUserIds = new Set<string>();

async function ensureOwner(id: string) {
  createdUserIds.add(id);

  await prisma.adminUser.upsert({
    where: { id },
    create: {
      id,
      name: `Owner ${id}`,
      email: `${id}@example.com`,
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
    },
    update: {},
  });
}

async function cleanup() {
  if (createdUserIds.size === 0) {
    return;
  }

  const ownerIds = Array.from(createdUserIds);
  await prisma.adminFile.deleteMany({ where: { ownerId: { in: ownerIds } } });
  await prisma.adminUser.deleteMany({ where: { id: { in: ownerIds } } });
  createdUserIds.clear();
}

afterEach(async () => {
  await cleanup();
});

describe("Admin File active record integration", () => {
  it("lista por ownerId + mimeType e busca", async () => {
    const ownerId = `it-admin-owner-${crypto.randomUUID()}`;
    await ensureOwner(ownerId);

    await prisma.adminFile.createMany({
      data: [
        {
          id: `it-admin-file-${crypto.randomUUID()}`,
          name: "relatorio.pdf",
          sizeBytes: 100,
          mimeType: "application/pdf",
          ownerId,
          blobUrl: "https://example.com/relatorio.pdf",
          uploadedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        {
          id: `it-admin-file-${crypto.randomUUID()}`,
          name: "foto.png",
          sizeBytes: 120,
          mimeType: "image/png",
          ownerId,
          blobUrl: "https://example.com/foto.png",
          uploadedAt: new Date("2024-01-02T00:00:00.000Z"),
        },
      ],
    });

    const output = await File.list({
      page: 1,
      pageSize: 10,
      ownerId,
      mimeType: "application/pdf",
      search: "relatorio",
    });

    expect(output.meta.total).toBe(1);
    expect(output.data).toHaveLength(1);
    expect(output.data[0]?.toJSON().mimeType).toBe("application/pdf");
  });

  it("ordena por uploadedAt desc e respeita paginação", async () => {
    const ownerId = `it-admin-owner-${crypto.randomUUID()}`;
    await ensureOwner(ownerId);

    const oldId = `it-admin-file-${crypto.randomUUID()}`;
    const newId = `it-admin-file-${crypto.randomUUID()}`;

    await prisma.adminFile.createMany({
      data: [
        {
          id: oldId,
          name: "old.txt",
          sizeBytes: 10,
          mimeType: "text/plain",
          ownerId,
          blobUrl: "https://example.com/old.txt",
          uploadedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        {
          id: newId,
          name: "new.txt",
          sizeBytes: 11,
          mimeType: "text/plain",
          ownerId,
          blobUrl: "https://example.com/new.txt",
          uploadedAt: new Date("2024-01-02T00:00:00.000Z"),
        },
      ],
    });

    const output = await File.list({ page: 1, pageSize: 1, ownerId });

    expect(output.data).toHaveLength(1);
    expect(output.data[0]?.id).toBe(newId);
    expect(output.meta.total).toBeGreaterThanOrEqual(2);
  });
});
