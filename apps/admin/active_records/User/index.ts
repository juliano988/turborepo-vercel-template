import { prisma, type Prisma } from "@repo/db";
import { UserListInput, UserListOutput, UserProps } from "./types";

export class User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly role: string | null;
  readonly banned: boolean | null;
  readonly banReason: string | null;
  readonly banExpires: Date | null;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.emailVerified = props.emailVerified;
    this.image = props.image;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.role = props.role;
    this.banned = props.banned;
    this.banReason = props.banReason;
    this.banExpires = props.banExpires;
  }

  static async list(input: UserListInput = {}): Promise<UserListOutput> {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 10));

    const where: Prisma.AdminUserWhereInput = {
      ...(input.search
        ? {
            OR: [
              { name: { contains: input.search, mode: "insensitive" } },
              { email: { contains: input.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(input.role ? { role: input.role } : {}),
      ...(typeof input.emailVerified === "boolean"
        ? { emailVerified: input.emailVerified }
        : {}),
      ...(typeof input.banned === "boolean" ? { banned: input.banned } : {}),
    };

    const [total, users] = await Promise.all([
      prisma.adminUser.count({ where }),
      prisma.adminUser.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: users.map((user) => User.fromPersistence(user)),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  toJSON(): UserProps {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      emailVerified: this.emailVerified,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: this.role,
      banned: this.banned,
      banReason: this.banReason,
      banExpires: this.banExpires,
    };
  }

  private static fromPersistence(record: UserProps): User {
    return new User(record);
  }
}
