import { beforeEach, describe, expect, it, vi } from "vitest";
import { UploadManyFilesUseCase } from ".";

const { removeMock, uploadManyMock } = vi.hoisted(() => ({
  removeMock: vi.fn(),
  uploadManyMock: vi.fn(),
}));

vi.mock("@repo/storage", () => ({
  remove: removeMock,
  uploadMany: uploadManyMock,
}));

describe("UploadManyFilesUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna vazio quando nao recebe arquivos", async () => {
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

    const useCase = new UploadManyFilesUseCase(fileRepository);

    const result = await useCase.execute({
      ownerId: "owner-1",
      files: [],
    });

    expect(uploadManyMock).not.toHaveBeenCalled();
    expect(fileRepository.saveMany).not.toHaveBeenCalled();
    expect(result).toEqual({ uploadedFiles: [], failedFiles: [] });
  });

  it("faz upload, persiste e mapeia falhas", async () => {
    const body = new Blob(["hello"]);
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    uploadManyMock.mockImplementation(async (items: Array<{ filename: string; options: { multipart: boolean; folder: string; contentType: string; access: string } }>) => ({
      successes: [
        {
          item: items[0],
          blob: { url: "https://blob.example.com/report.pdf" },
        },
      ],
      failures: [
        {
          item: { filename: "failed.pdf" },
          error: new Error("upload failed"),
        },
      ],
    }));

    const useCase = new UploadManyFilesUseCase(fileRepository);

    const result = await useCase.execute({
      ownerId: "owner-1",
      chunkSize: 2,
      files: [
        {
          filename: "report.pdf",
          body,
          mimeType: "application/pdf",
          sizeBytes: 6 * 1024 * 1024,
        },
      ],
    });

    expect(uploadManyMock).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          filename: "report.pdf",
          body,
          options: {
            folder: "users/owner-1/",
            contentType: "application/pdf",
            access: "private",
            multipart: true,
          },
        }),
      ],
      {
        chunkSize: 2,
        failFast: false,
      }
    );
    expect(fileRepository.saveMany).toHaveBeenCalledTimes(1);
    expect(result.uploadedFiles).toHaveLength(1);
    expect(result.uploadedFiles[0]?.name).toBe("report.pdf");
    expect(result.failedFiles).toEqual([
      {
        filename: "failed.pdf",
        error: "upload failed",
      },
    ]);
  });

  it("remove blobs ja enviados quando a persistencia falha", async () => {
    const persistenceError = new Error("db down");
    const fileRepository = {
      save: vi.fn(),
      saveMany: vi.fn().mockRejectedValue(persistenceError),
      findById: vi.fn(),
      findByIds: vi.fn(),
      findByOwner: vi.fn(),
      findByNameAndOwner: vi.fn(),
      remove: vi.fn(),
      removeMany: vi.fn(),
    };

    uploadManyMock.mockImplementation(async (items: Array<{ filename: string }>) => ({
      successes: [
        {
          item: items[0],
          blob: { url: "https://blob.example.com/report.pdf" },
        },
      ],
      failures: [],
    }));

    const useCase = new UploadManyFilesUseCase(fileRepository);

    await expect(
      useCase.execute({
        ownerId: "owner-1",
        files: [
          {
            filename: "report.pdf",
            body: new Blob(["hello"]),
            mimeType: "application/pdf",
            sizeBytes: 128,
          },
        ],
      })
    ).rejects.toThrow(persistenceError);

    expect(removeMock).toHaveBeenCalledWith(["https://blob.example.com/report.pdf"]);
  });
});
