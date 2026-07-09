import { remove, uploadMany, type UploadManyItem } from "@repo/storage";
import { File } from "../../agregates/File";
import type { iFileRepository } from "../../agregates/File/repository";
import { UploadManyFilesInput, UploadManyFilesOutput } from "./types";

export class UploadManyFilesService {
  constructor(private readonly fileRepository: iFileRepository) {}

  async execute(input: UploadManyFilesInput): Promise<UploadManyFilesOutput> {
    if (input.files.length === 0) {
      return { uploadedFiles: [], failedFiles: [] };
    }

    const itemMetadata = new WeakMap<
      UploadManyItem,
      UploadManyFilesInput["files"][number]
    >();
    const uploadItems: UploadManyItem[] = input.files.map((file) => {
      const item: UploadManyItem = {
        filename: file.filename,
        body: file.body,
        options: {
          folder: `users/${input.ownerId}/`,
          contentType: file.mimeType,
          access: "private",
          multipart: file.sizeBytes > 5 * 1024 * 1024,
        },
      };

      itemMetadata.set(item, file);
      return item;
    });

    const uploadResult = await uploadMany(uploadItems, {
      chunkSize: input.chunkSize,
      failFast: false,
    });

    const domainFiles = uploadResult.successes.map(({ item, blob }) => {
      const fileInput = itemMetadata.get(item);

      if (!fileInput) {
        throw new Error("Falha ao mapear metadados dos arquivos enviados.");
      }

      return File.create({
        name: fileInput.filename,
        sizeBytes: fileInput.sizeBytes,
        mimeType: fileInput.mimeType,
        ownerId: input.ownerId,
        blobUrl: blob.url,
      });
    });

    try {
      await this.fileRepository.saveMany(domainFiles);
    } catch (error) {
      const uploadedBlobUrls = uploadResult.successes.map(
        ({ blob }) => blob.url
      );

      if (uploadedBlobUrls.length > 0) {
        try {
          await remove(uploadedBlobUrls);
        } catch {
          // Melhor esforço para evitar blobs órfãos após falha de persistência.
        }
      }

      throw error;
    }

    return {
      uploadedFiles: domainFiles.map((file) => file.toJSON()),
      failedFiles: uploadResult.failures.map(({ item, error }) => ({
        filename: item.filename,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      })),
    };
  }
}
