import { upload } from "@repo/storage";
import { File } from "../../agregates/File";
import type { FileRepository } from "../../agregates/File/repository";
import { UploadFileInput, UploadFileOutput } from "./types";

export class UploadFileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(input: UploadFileInput): Promise<UploadFileOutput> {
    const blob = await upload(input.filename, input.body, {
      folder: `users/${input.ownerId}/`,
      contentType: input.mimeType,
      access: "private",
      multipart: input.sizeBytes > 5 * 1024 * 1024,
    });

    const file = File.create({
      name: input.filename,
      sizeBytes: input.sizeBytes,
      mimeType: input.mimeType,
      ownerId: input.ownerId,
      blobUrl: blob.url,
    });

    await this.fileRepository.save(file);

    return file.toJSON();
  }
}
