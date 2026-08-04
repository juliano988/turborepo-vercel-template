import { describe, expect, it, vi } from "vitest";
import { File } from "../../agregates/File";
import { UserId } from "../../agregates/User/vo/UserId";
import { ListUserFilesUseCase } from ".";

function createFile(ownerId: string, name: string) {
  return File.create({
    name,
    sizeBytes: 128,
    mimeType: "application/pdf",
    ownerId,
    blobUrl: `https://example.com/${name}`,
  });
}

describe("ListUserFilesUseCase", () => {
  it("lista e serializa os arquivos do usuario", async () => {
    const ownerId = UserId.from("owner-1");
    const files = [createFile(ownerId.toString(), "one.pdf"), createFile(ownerId.toString(), "two.pdf")];
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn().mockResolvedValue(files),
      findByNameAndOwner: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new ListUserFilesUseCase(fileRepository);

    const result = await useCase.execute({ ownerId });

    expect(fileRepository.findByOwner).toHaveBeenCalledWith(ownerId);
    expect(result).toEqual(files.map((file) => file.toJSON()));
  });
});
