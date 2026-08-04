import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "@repo/db";
import { UserId } from "../../agregates/User/vo/UserId";
import { UserRepository } from ".";

const createdUserIds = new Set<string>();

async function cleanupUsers() {
  if (createdUserIds.size === 0) {
    return;
  }

  const ids = Array.from(createdUserIds);
  await prisma.appUser.deleteMany({ where: { id: { in: ids } } });
  createdUserIds.clear();
}

afterEach(async () => {
  await cleanupUsers();
});

describe("UserRepository integration", () => {
  it("busca usuario por id em banco real", async () => {
    const userId = `it-user-${crypto.randomUUID()}`;
    createdUserIds.add(userId);

    await prisma.appUser.create({
      data: {
        id: userId,
        apiKey: "api-key-it-1",
      },
    });

    const repository = new UserRepository();
    const user = await repository.findById(UserId.from(userId));

    expect(user).not.toBeNull();
    expect(user?.id.toString()).toBe(userId);
    expect(user?.apiKey?.toString()).toBe("api-key-it-1");
  });

  it("busca usuario por apiKey em banco real", async () => {
    const userId = `it-user-${crypto.randomUUID()}`;
    createdUserIds.add(userId);

    await prisma.appUser.create({
      data: {
        id: userId,
        apiKey: "api-key-it-2",
      },
    });

    const repository = new UserRepository();
    const user = await repository.findByApiKey("api-key-it-2");

    expect(user).not.toBeNull();
    expect(user?.id.toString()).toBe(userId);
  });
});
