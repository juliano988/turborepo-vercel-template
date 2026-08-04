import { beforeEach, describe, expect, it, vi } from "vitest";
import { File } from "../../agregates/File";
import { FileId } from "../../agregates/File/vo/FileId";
import { FileName } from "../../agregates/File/vo/FileName";
import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from ".";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    appFile: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@repo/db", () => ({
  prisma: prismaMock,
}));

function createFile(ownerId: string, name = "report.pdf") {
  return File.create({
    name,
    sizeBytes: 128,
    mimeType: "application/pdf",
    ownerId,
    blobUrl: `https://example.com/${name}`,
  });
}

describe("FileRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("salva arquivo via upsert com os dados serializados do dominio", async () => {
    const file = createFile("owner-1");
    prismaMock.appFile.upsert.mockResolvedValue(undefined);

    const repository = new FileRepository();

    await repository.save(file);

    expect(prismaMock.appFile.upsert).toHaveBeenCalledWith({
      where: { id: file.id.toString() },
      create: {
        id: file.id.toString(),
        name: file.name.full,
        sizeBytes: file.size.toBytes(),
        mimeType: file.mimeType.toString(),
        ownerId: file.ownerId.toString(),
        blobUrl: file.blobUrl.toString(),
        uploadedAt: file.uploadedAt,
      },
      update: {
        name: file.name.full,
        sizeBytes: file.size.toBytes(),
        mimeType: file.mimeType.toString(),
        ownerId: file.ownerId.toString(),
        blobUrl: file.blobUrl.toString(),
        uploadedAt: file.uploadedAt,
      },
    });
  });

  it("busca arquivos do owner e reconstitui o dominio", async () => {
    const file = createFile("owner-1", "report.pdf");
    prismaMock.appFile.findMany.mockResolvedValue([
      {
        id: file.id.toString(),
        name: file.name.full,
        sizeBytes: file.size.toBytes(),
        mimeType: file.mimeType.toString(),
        ownerId: file.ownerId.toString(),
        blobUrl: file.blobUrl.toString(),
        uploadedAt: file.uploadedAt,
      },
    ]);

    const repository = new FileRepository();
    const ownerId = UserId.from("owner-1");

    const files = await repository.findByOwner(ownerId);

    expect(prismaMock.appFile.findMany).toHaveBeenCalledWith({
      where: { ownerId: "owner-1" },
      orderBy: { uploadedAt: "desc" },
    });
    expect(files).toHaveLength(1);
    expect(files[0]?.toJSON()).toEqual(file.toJSON());
  });

  it("nao consulta o banco em findByIds quando a entrada e vazia", async () => {
    const repository = new FileRepository();

    const files = await repository.findByIds([]);

    expect(prismaMock.appFile.findMany).not.toHaveBeenCalled();
    expect(files).toEqual([]);
  });

  it("busca por nome e owner usando os value objects", async () => {
    const file = createFile("owner-1", "report.pdf");
    prismaMock.appFile.findFirst.mockResolvedValue({
      id: file.id.toString(),
      name: file.name.full,
      sizeBytes: file.size.toBytes(),
      mimeType: file.mimeType.toString(),
      ownerId: file.ownerId.toString(),
      blobUrl: file.blobUrl.toString(),
      uploadedAt: file.uploadedAt,
    });

    const repository = new FileRepository();

    const result = await repository.findByNameAndOwner(
      FileName.from("report.pdf"),
      UserId.from("owner-1")
    );

    expect(prismaMock.appFile.findFirst).toHaveBeenCalledWith({
      where: {
        name: "report.pdf",
        ownerId: "owner-1",
      },
    });
    expect(result?.toJSON()).toEqual(file.toJSON());
  });

  it("remove varios arquivos de uma vez", async () => {
    const firstId = FileId.from(crypto.randomUUID());
    const secondId = FileId.from(crypto.randomUUID());
    prismaMock.appFile.deleteMany.mockResolvedValue({ count: 2 });

    const repository = new FileRepository();

    await repository.removeMany([firstId, secondId]);

    expect(prismaMock.appFile.deleteMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: [firstId.toString(), secondId.toString()],
        },
      },
    });
  });
});
