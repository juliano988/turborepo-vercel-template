import { prisma } from "@repo/db";
import { User } from "../../agregates/User";
import { UserId } from "../../agregates/User/vo/UserId";
import type { UserRepository } from "./interfaces";

export class PrismaUserRepository implements UserRepository {
  async findById(id: UserId): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { id: id.value },
    });

    return record ? PrismaUserRepository.toDomain(record) : null;
  }

  private static toDomain(record: { id: string }): User {
    return User.reconstitute({
      id: UserId.from(record.id),
    });
  }
}
