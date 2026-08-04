import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/db", () => ({
  prisma: {
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

import * as requireSessionModule from "../utils/requireSession";
import { DeleteManyFilesUseCase } from "../../useCases/DeleteManyFilesUseCase";
import { deleteFilesAction } from "./deleteFilesAction";

describe("deleteFilesAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna vazio sem consultar sessao quando fileIds e invalido", async () => {
    const requireSessionSpy = vi
      .spyOn(requireSessionModule, "requireSession")
      .mockResolvedValue({ user: { id: "user-1" } } as never);
    const executeSpy = vi.spyOn(DeleteManyFilesUseCase.prototype, "execute");

    const result = await deleteFilesAction([]);

    expect(requireSessionSpy).toHaveBeenCalledOnce();
    expect(executeSpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      deletedFileIds: [],
      skippedFileIds: [],
    });
  });

  it("delega a exclusao para o use case com ownerId da sessao", async () => {
    vi.spyOn(requireSessionModule, "requireSession").mockResolvedValue({ user: { id: "user-1" } } as never);
    const executeSpy = vi.spyOn(DeleteManyFilesUseCase.prototype, "execute").mockResolvedValue({
      deletedFileIds: ["file-1"],
      skippedFileIds: ["file-2"],
    });

    const result = await deleteFilesAction(["file-1", "file-2"]);

    expect(executeSpy).toHaveBeenCalledWith({
      ownerId: expect.objectContaining({ toString: expect.any(Function) }),
      fileIds: ["file-1", "file-2"],
    });
    expect(result).toEqual({
      deletedFileIds: ["file-1"],
      skippedFileIds: ["file-2"],
    });
  });
});
