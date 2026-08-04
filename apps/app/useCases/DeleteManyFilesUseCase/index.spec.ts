import { beforeEach, describe, expect, it, vi } from "vitest";
import { File } from "../../agregates/File";
import { FileId } from "../../agregates/File/vo/FileId";
import { UserId } from "../../agregates/User/vo/UserId";
import { DeleteManyFilesUseCase } from ".";

const { removeMock } = vi.hoisted(() => ({
  removeMock: vi.fn(),
}));

vi.mock("@repo/storage", () => ({
  remove: removeMock,
}));

function createFile(ownerId: string, name: string) {
  return File.create({
    name,
    sizeBytes: 128,
    mimeType: "application/pdf",
    ownerId,
    blobUrl: `https://example.com/${name}`,
  });
}

describe("DeleteManyFilesUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("remove apenas arquivos validos pertencentes ao owner e marca o resto como skip", async () => {
    const ownerId = UserId.from("owner-1");
    const ownedFile = createFile(ownerId.toString(), "owned.pdf");
    const foreignFile = createFile("other-owner", "foreign.pdf");
    const invalidFileId = "not-a-uuid";
    const duplicateId = ownedFile.id.toString();
    const missingFileId = crypto.randomUUID();
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn().mockResolvedValue([ownedFile, foreignFile]),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new DeleteManyFilesUseCase(fileRepository);

    const result = await useCase.execute({
      ownerId,
      fileIds: [duplicateId, duplicateId, foreignFile.id.toString(), invalidFileId, missingFileId],
    });

    expect(fileRepository.findByIds).toHaveBeenCalledWith([
      FileId.from(duplicateId),
      FileId.from(foreignFile.id.toString()),
      FileId.from(missingFileId),
    ]);
    expect(removeMock).toHaveBeenCalledWith([ownedFile.blobUrl.toString()]);
    expect(fileRepository.removeMany).toHaveBeenCalledWith([ownedFile.id]);
    expect(result).toEqual({
      deletedFileIds: [ownedFile.id.toString()],
      skippedFileIds: [invalidFileId, foreignFile.id.toString(), missingFileId],
    });
  });

  it("nao chama storage nem repository quando nada pode ser removido", async () => {
    const ownerId = UserId.from("owner-1");
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn().mockResolvedValue([]),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new DeleteManyFilesUseCase(fileRepository);

    const result = await useCase.execute({
      ownerId,
      fileIds: ["bad-id"],
    });

    expect(removeMock).not.toHaveBeenCalled();
    expect(fileRepository.removeMany).not.toHaveBeenCalled();
    expect(result).toEqual({
      deletedFileIds: [],
      skippedFileIds: ["bad-id"],
    });
  });
});
