import { prisma, type Prisma } from "@repo/db";
import { FileListInput, FileListOutput, FileProps } from "./types";

export class File {
  readonly id: string;
  readonly name: string;
  readonly sizeBytes: number;
  readonly mimeType: string;
  readonly ownerId: string;
  readonly blobUrl: string;
  readonly uploadedAt: Date;

  private constructor(props: FileProps) {
    this.id = props.id;
    this.name = props.name;
    this.sizeBytes = props.sizeBytes;
    this.mimeType = props.mimeType;
    this.ownerId = props.ownerId;
    this.blobUrl = props.blobUrl;
    this.uploadedAt = props.uploadedAt;
  }

  static async list(input: FileListInput = {}): Promise<FileListOutput> {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 10));

    const where: Prisma.AdminFileWhereInput = {
      ...(input.search
        ? {
            OR: [
              { name: { contains: input.search, mode: "insensitive" } },
              { mimeType: { contains: input.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(input.ownerId ? { ownerId: input.ownerId } : {}),
      ...(input.mimeType ? { mimeType: input.mimeType } : {}),
    };

    const [total, files] = await Promise.all([
      prisma.adminFile.count({ where }),
      prisma.adminFile.findMany({
        where,
        orderBy: { uploadedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: files.map((file) => File.fromPersistence(file)),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  toJSON(): FileProps {
    return {
      id: this.id,
      name: this.name,
      sizeBytes: this.sizeBytes,
      mimeType: this.mimeType,
      ownerId: this.ownerId,
      blobUrl: this.blobUrl,
      uploadedAt: this.uploadedAt,
    };
  }

  private static fromPersistence(record: FileProps): File {
    return new File(record);
  }
}
