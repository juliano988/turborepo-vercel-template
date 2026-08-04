import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserRepository } from ".";
import { UserId } from "../../agregates/User/vo/UserId";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    appUser: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@repo/db", () => ({
  prisma: prismaMock,
}));

describe("UserRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("busca usuario por id e reconstitui o agregado", async () => {
    const userId = UserId.from("user-1");

    prismaMock.appUser.findUnique.mockResolvedValue({
      id: "user-1",
      apiKey: "api-key-1",
    });

    const repository = new UserRepository();

    const user = await repository.findById(userId);

    expect(prismaMock.appUser.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { id: true, apiKey: true },
    });
    expect(user?.id.toString()).toBe("user-1");
    expect(user?.apiKey?.toString()).toBe("api-key-1");
  });

  it("retorna nulo quando nao encontra usuario por apiKey", async () => {
    prismaMock.appUser.findFirst.mockResolvedValue(null);

    const repository = new UserRepository();

    const user = await repository.findByApiKey("missing-key");

    expect(prismaMock.appUser.findFirst).toHaveBeenCalledWith({
      where: { apiKey: "missing-key" },
      select: { id: true, apiKey: true },
    });
    expect(user).toBeNull();
  });
});
