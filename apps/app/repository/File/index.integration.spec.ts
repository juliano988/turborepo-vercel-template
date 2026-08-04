import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "@repo/db";
import { File } from "../../agregates/File";
import { FileId } from "../../agregates/File/vo/FileId";
import { FileName } from "../../agregates/File/vo/FileName";
import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from ".";

const createdOwnerIds = new Set<string>();

async function ensureOwner(id: string) {
  createdOwnerIds.add(id);
  await prisma.appUser.upsert({
    where: { id },
    create: { id, apiKey: `api-${id}` },
    update: {},
  });
}

async function cleanupOwners() {
  if (createdOwnerIds.size === 0) {
    return;
  }

  const ownerIds = Array.from(createdOwnerIds);
  await prisma.appFile.deleteMany({ where: { ownerId: { in: ownerIds } } });
  await prisma.appUser.deleteMany({ where: { id: { in: ownerIds } } });
  createdOwnerIds.clear();
}

afterEach(async () => {
  await cleanupOwners();
});

function createFile(ownerId: string, name: string) {
  return File.create({
    name,
    sizeBytes: 128,
    mimeType: "application/pdf",
    ownerId,
    blobUrl: `https://example.com/${name}`,
  });
}

describe("FileRepository integration", () => {
  it("salva e busca arquivo por id em banco real", async () => {
    const ownerIdValue = `it-owner-${crypto.randomUUID()}`;
    await ensureOwner(ownerIdValue);

    const repository = new FileRepository();
    const file = createFile(ownerIdValue, "invoice.pdf");

    await repository.save(file);

    const found = await repository.findById(file.id);

    expect(found).not.toBeNull();
    expect(found?.toJSON()).toEqual(file.toJSON());
  });

  it("lista arquivos do owner em ordem de uploadedAt desc", async () => {
    const ownerIdValue = `it-owner-${crypto.randomUUID()}`;
    await ensureOwner(ownerIdValue);

    const oldId = crypto.randomUUID();
    const newId = crypto.randomUUID();

    await prisma.appFile.createMany({
      data: [
        {
          id: oldId,
          name: "old.pdf",
          sizeBytes: 100,
          mimeType: "application/pdf",
          ownerId: ownerIdValue,
          blobUrl: "https://example.com/old.pdf",
          uploadedAt: new Date("2024-01-01T00:00:00.000Z"),
        },
        {
          id: newId,
          name: "new.pdf",
          sizeBytes: 110,
          mimeType: "application/pdf",
          ownerId: ownerIdValue,
          blobUrl: "https://example.com/new.pdf",
          uploadedAt: new Date("2024-01-02T00:00:00.000Z"),
        },
      ],
    });

    const repository = new FileRepository();
    const files = await repository.findByOwner(UserId.from(ownerIdValue));

    expect(files).toHaveLength(2);
    expect(files[0]?.id.toString()).toBe(newId);
    expect(files[1]?.id.toString()).toBe(oldId);
  });

  it("busca por nome e owner e remove varios ids", async () => {
    const ownerIdValue = `it-owner-${crypto.randomUUID()}`;
    await ensureOwner(ownerIdValue);

    const repository = new FileRepository();
    const first = createFile(ownerIdValue, "report.pdf");
    const second = createFile(ownerIdValue, "report-2.pdf");

    await repository.saveMany([first, second]);

    const found = await repository.findByNameAndOwner(
      FileName.from("report.pdf"),
      UserId.from(ownerIdValue)
    );

    expect(found?.id.toString()).toBe(first.id.toString());

    await repository.removeMany([first.id, second.id]);

    const afterDelete = await repository.findByIds([
      FileId.from(first.id.toString()),
      FileId.from(second.id.toString()),
    ]);

    expect(afterDelete).toEqual([]);
  });
});
