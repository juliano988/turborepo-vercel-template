import { describe, expect, it, vi } from "vitest";
import { File } from "../../agregates/File";
import { User } from "../../agregates/User";
import { UserId } from "../../agregates/User/vo/UserId";
import { DownloadFileByNameUseCase } from ".";

function createUser(id: string, apiKey?: string) {
  return User.reconstitute({
    id: UserId.from(id),
    apiKey: apiKey ?? null,
  });
}

function createFile(ownerId: string, name = "report.pdf") {
  return File.create({
    name,
    sizeBytes: 128,
    mimeType: "application/pdf",
    ownerId,
    blobUrl: "https://example.com/report.pdf",
  });
}

describe("DownloadFileByNameUseCase", () => {
  it("busca pelo ownerId informado quando nao recebe apiKey", async () => {
    const file = createFile("owner-1");
    const userRepository = {
      findById: vi.fn(),
      findByApiKey: vi.fn(),
    };
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn().mockResolvedValue(file),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new DownloadFileByNameUseCase(userRepository, fileRepository);
    const ownerId = UserId.from("owner-1");

    const result = await useCase.execute({
      filename: "report.pdf",
      ownerId,
    });

    expect(userRepository.findByApiKey).not.toHaveBeenCalled();
    expect(fileRepository.findByNameAndOwner).toHaveBeenCalledWith(
      expect.objectContaining({ full: "report.pdf" }),
      ownerId
    );
    expect(result).toEqual({
      file: file.toJSON(),
      downloadUrl: "/app/api/files/report.pdf",
    });
  });

  it("resolve a apiKey antes de buscar o arquivo", async () => {
    const apiUser = createUser("owner-by-key", " key-123 ");
    const file = createFile("owner-by-key", "invoice 2026.pdf");
    const userRepository = {
      findById: vi.fn(),
      findByApiKey: vi.fn().mockResolvedValue(apiUser),
    };
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn().mockResolvedValue(file),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new DownloadFileByNameUseCase(userRepository, fileRepository);

    const result = await useCase.execute({
      filename: "invoice 2026.pdf",
      ownerId: UserId.from("fallback-owner"),
      apiKey: "  key-123  ",
    });

    expect(userRepository.findByApiKey).toHaveBeenCalledWith("key-123");
    expect(fileRepository.findByNameAndOwner).toHaveBeenCalledWith(
      expect.objectContaining({ full: "invoice 2026.pdf" }),
      apiUser.id
    );
    expect(result.downloadUrl).toBe("/app/api/files/invoice%202026.pdf");
  });

  it("retorna nulo quando a apiKey nao encontra usuario", async () => {
    const userRepository = {
      findById: vi.fn(),
      findByApiKey: vi.fn().mockResolvedValue(null),
    };
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new DownloadFileByNameUseCase(userRepository, fileRepository);

    const result = await useCase.execute({
      filename: "report.pdf",
      ownerId: UserId.from("owner-1"),
      apiKey: "missing-key",
    });

    expect(fileRepository.findByNameAndOwner).not.toHaveBeenCalled();
    expect(result).toEqual({
      file: null,
      downloadUrl: null,
    });
  });

  it("retorna nulo quando o arquivo nao existe", async () => {
    const userRepository = {
      findById: vi.fn(),
      findByApiKey: vi.fn(),
    };
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn(),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn().mockResolvedValue(null),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    const useCase = new DownloadFileByNameUseCase(userRepository, fileRepository);

    const result = await useCase.execute({
      filename: "report.pdf",
      ownerId: UserId.from("owner-1"),
    });

    expect(result).toEqual({
      file: null,
      downloadUrl: null,
    });
  });
});
