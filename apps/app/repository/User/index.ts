import { prisma } from "@repo/db";
import { User } from "../../agregates/User";
import { UserId } from "../../agregates/User/vo/UserId";
import type { iUserRepository } from "../../agregates/User/repository";

export class UserRepository implements iUserRepository {
  async findById(id: UserId): Promise<User | null> {
    const record = await prisma.user.findUnique({
      where: { id: id.toString() },
    });

    return record ? UserRepository.toDomain(record) : null;
  }

  private static toDomain(record: { id: string }): User {
    return User.reconstitute({
      id: UserId.from(record.id),
    });
  }
}
