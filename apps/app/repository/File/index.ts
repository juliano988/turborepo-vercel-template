import { prisma } from "@repo/db";
import { File } from "../../agregates/File";
import type { iFileRepository } from "../../agregates/File/repository";
import { BlobUrl } from "../../agregates/File/vo/BlobUrl";
import { FileId } from "../../agregates/File/vo/FileId";
import { FileName } from "../../agregates/File/vo/FileName";
import { FileSize } from "../../agregates/File/vo/FileSize";
import { MimeType } from "../../agregates/File/vo/MimeType";
import { UserId } from "../../agregates/User/vo/UserId";

export class FileRepository implements iFileRepository {
  async save(file: File): Promise<void> {
    const data = {
      name: file.name.full,
      sizeBytes: file.size.toBytes(),
      mimeType: file.mimeType.toString(),
      ownerId: file.ownerId.toString(),
      blobUrl: file.blobUrl.toString(),
      uploadedAt: file.uploadedAt,
    };

    await prisma.file.upsert({
      where: { id: file.id.toString() },
      create: { id: file.id.toString(), ...data },
      update: data,
    });
  }

  async saveMany(files: File[]): Promise<void> {
    if (files.length === 0) {
      return;
    }

    await prisma.$transaction(
      files.map((file) => {
        const data = {
          name: file.name.full,
          sizeBytes: file.size.toBytes(),
          mimeType: file.mimeType.toString(),
          ownerId: file.ownerId.toString(),
          blobUrl: file.blobUrl.toString(),
          uploadedAt: file.uploadedAt,
        };

        return prisma.file.upsert({
          where: { id: file.id.toString() },
          create: { id: file.id.toString(), ...data },
          update: data,
        });
      })
    );
  }

  async findById(id: FileId): Promise<File | null> {
    const record = await prisma.file.findUnique({
      where: { id: id.toString() },
    });

    return record ? FileRepository.toDomain(record) : null;
  }

  async findByIds(ids: FileId[]): Promise<File[]> {
    if (ids.length === 0) {
      return [];
    }

    const records = await prisma.file.findMany({
      where: {
        id: {
          in: ids.map((id) => id.toString()),
        },
      },
    });

    return records.map(FileRepository.toDomain);
  }

  async findByOwner(ownerId: UserId): Promise<File[]> {
    const records = await prisma.file.findMany({
      where: { ownerId: ownerId.toString() },
      orderBy: { uploadedAt: "desc" },
    });

    return records.map(FileRepository.toDomain);
  }

  async remove(id: FileId): Promise<void> {
    await prisma.file.delete({
      where: { id: id.toString() },
    });
  }

  async removeMany(ids: FileId[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }

    await prisma.file.deleteMany({
      where: {
        id: {
          in: ids.map((id) => id.toString()),
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
