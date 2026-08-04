import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "@repo/db";
import { User } from ".";

const createdUserIds = new Set<string>();

async function cleanupUsers() {
  if (createdUserIds.size === 0) {
    return;
  }

  await prisma.adminUser.deleteMany({
    where: { id: { in: Array.from(createdUserIds) } },
  });
  createdUserIds.clear();
}

afterEach(async () => {
  await cleanupUsers();
});

function createAdminUser(data: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  role?: string;
  emailVerified?: boolean;
  banned?: boolean;
}) {
  createdUserIds.add(data.id);

  return prisma.adminUser.create({
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
      emailVerified: data.emailVerified ?? false,
      image: null,
      createdAt: data.createdAt,
      updatedAt: data.createdAt,
      role: data.role ?? "user",
      banned: data.banned ?? false,
      banReason: null,
      banExpires: null,
    },
  });
}

describe("Admin User active record integration", () => {
  it("lista com filtros de busca/role/emailVerified e paginação", async () => {
    const now = Date.now();

    await createAdminUser({
      id: `it-admin-user-${crypto.randomUUID()}`,
      name: "Ana Admin",
      email: `ana-${crypto.randomUUID()}@example.com`,
      createdAt: new Date(now - 2000),
      role: "admin",
      emailVerified: true,
    });

    await createAdminUser({
      id: `it-admin-user-${crypto.randomUUID()}`,
      name: "Bruno User",
      email: `bruno-${crypto.randomUUID()}@example.com`,
      createdAt: new Date(now - 1000),
      role: "user",
      emailVerified: false,
    });

    const output = await User.list({
      page: 1,
      pageSize: 10,
      search: "ana",
      role: "admin",
      emailVerified: true,
    });

    expect(output.meta.page).toBe(1);
    expect(output.meta.pageSize).toBe(10);
    expect(output.meta.total).toBe(1);
    expect(output.meta.totalPages).toBe(1);
    expect(output.data).toHaveLength(1);
    expect(output.data[0]?.toJSON().name).toBe("Ana Admin");
  });

  it("ordena por createdAt desc e limita por pageSize", async () => {
    const oldId = `it-admin-user-${crypto.randomUUID()}`;
    const newId = `it-admin-user-${crypto.randomUUID()}`;

    await createAdminUser({
      id: oldId,
      name: "Old",
      email: `old-${crypto.randomUUID()}@example.com`,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
    });

    await createAdminUser({
      id: newId,
      name: "New",
      email: `new-${crypto.randomUUID()}@example.com`,
      createdAt: new Date("2024-01-02T00:00:00.000Z"),
    });

    const output = await User.list({ page: 1, pageSize: 1 });

    expect(output.data).toHaveLength(1);
    expect(output.data[0]?.id).toBe(newId);
    expect(output.meta.total).toBeGreaterThanOrEqual(2);
  });
});
