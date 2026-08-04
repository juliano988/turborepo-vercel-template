import { prisma } from "@repo/db";
import { User } from "../../agregates/User";
import type { iUserRepository } from "../../agregates/User/repository";
import { UserId } from "../../agregates/User/vo/UserId";

export class UserRepository implements iUserRepository {
  async findById(id: UserId): Promise<User | null> {
    const record = await prisma.appUser.findUnique({
      where: { id: id.toString() },
      select: { id: true, apiKey: true },
    });

    return record ? UserRepository.toDomain(record) : null;
  }

  async findByApiKey(apiKey: string): Promise<User | null> {
    const record = await prisma.appUser.findFirst({
      where: { apiKey },
      select: { id: true, apiKey: true },
    });

    return record ? UserRepository.toDomain(record) : null;
  }

  private static toDomain(record: { id: string; apiKey: string | null }): User {
    return User.reconstitute({
      id: UserId.from(record.id),
      apiKey: record.apiKey,
    });
  }
}
