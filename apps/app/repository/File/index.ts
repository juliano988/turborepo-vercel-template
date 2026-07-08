import { prisma } from "@repo/db";
import { File } from "../../agregates/File";
import type { FileRepository } from "../../agregates/File/repository";
import { BlobUrl } from "../../agregates/File/vo/BlobUrl";
import { FileId } from "../../agregates/File/vo/FileId";
import { FileName } from "../../agregates/File/vo/FileName";
import { FileSize } from "../../agregates/File/vo/FileSize";
import { MimeType } from "../../agregates/File/vo/MimeType";
import { UserId } from "../../agregates/User/vo/UserId";

export class PrismaFileRepository implements FileRepository {
  async save(file: File): Promise<void> {
    const data = {
      name: file.name.full,
      sizeBytes: file.size.bytes,
      mimeType: file.mimeType.value,
      ownerId: file.ownerId.value,
      blobUrl: file.blobUrl.value,
      uploadedAt: file.uploadedAt,
    };

    await prisma.file.upsert({
      where: { id: file.id.value },
      create: { id: file.id.value, ...data },
      update: data,
    });
  }

  async findById(id: FileId): Promise<File | null> {
    const record = await prisma.file.findUnique({
      where: { id: id.value },
    });

    return record ? PrismaFileRepository.toDomain(record) : null;
  }

  async findByIds(ids: FileId[]): Promise<File[]> {
    if (ids.length === 0) {
      return [];
    }

    const records = await prisma.file.findMany({
      where: {
        id: {
          in: ids.map((id) => id.value),
        },
      },
    });

    return records.map(PrismaFileRepository.toDomain);
  }

  async findByOwner(ownerId: UserId): Promise<File[]> {
    const records = await prisma.file.findMany({
      where: { ownerId: ownerId.value },
      orderBy: { uploadedAt: "desc" },
    });

    return records.map(PrismaFileRepository.toDomain);
  }

  async remove(id: FileId): Promise<void> {
    await prisma.file.delete({
      where: { id: id.value },
    });
  }

  async removeMany(ids: FileId[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await prisma.file.deleteMany({
      where: {
        id: {
          in: ids.map((id) => id.value),
        },
      },
    });
  }

  private static toDomain(record: {
    id: string;
    name: string;
    sizeBytes: number;
    mimeType: string;
    ownerId: string;
    blobUrl: string;
    uploadedAt: Date;
  }): File {
    return File.reconstitute({
      id: FileId.from(record.id),
      name: FileName.from(record.name),
      size: FileSize.from(record.sizeBytes),
      mimeType: MimeType.from(record.mimeType),
      ownerId: UserId.from(record.ownerId),
      blobUrl: BlobUrl.from(record.blobUrl),
      uploadedAt: record.uploadedAt,
    });
  }
}
