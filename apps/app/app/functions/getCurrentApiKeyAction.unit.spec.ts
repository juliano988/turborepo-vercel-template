import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/db", () => ({
  prisma: {
    appUser: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import * as requireSessionModule from "../utils/requireSession";
import { UserRepository } from "../../repository/User";
import { getCurrentApiKeyAction } from "./getCurrentApiKeyAction";

describe("getCurrentApiKeyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna a apiKey atual do usuario autenticado", async () => {
    vi.spyOn(requireSessionModule, "requireSession").mockResolvedValue({ user: { id: "user-1" } } as never);
    const findByIdSpy = vi.spyOn(UserRepository.prototype, "findById").mockResolvedValue({
      apiKey: {
        toString: () => "api-key-1",
      },
    } as never);

    const result = await getCurrentApiKeyAction();

    expect(findByIdSpy).toHaveBeenCalledWith(
      expect.objectContaining({ toString: expect.any(Function) })
    );
    expect(result).toBe("api-key-1");
  });

  it("retorna nulo quando o usuario nao possui apiKey", async () => {
    vi.spyOn(requireSessionModule, "requireSession").mockResolvedValue({ user: { id: "user-1" } } as never);
    vi.spyOn(UserRepository.prototype, "findById").mockResolvedValue(null);

    const result = await getCurrentApiKeyAction();

    expect(result).toBeNull();
  });
});
