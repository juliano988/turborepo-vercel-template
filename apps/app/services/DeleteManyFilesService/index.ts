import { remove } from "@repo/storage";
import type { FileRepository } from "../../agregates/File/repository";
import { FileId } from "../../agregates/File/vo/FileId";
import { DeleteManyFilesInput, DeleteManyFilesOutput } from "./types";

export class DeleteManyFilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(input: DeleteManyFilesInput): Promise<DeleteManyFilesOutput> {
    const uniqueFileIds = Array.from(new Set(input.fileIds));
    const parsedFileIds: FileId[] = [];
    const skippedFileIds: string[] = [];

    for (const fileId of uniqueFileIds) {
      try {
        parsedFileIds.push(FileId.from(fileId));
      } catch {
        skippedFileIds.push(fileId);
      }
    }

    const files = await this.fileRepository.findByIds(parsedFileIds);
    const filesById = new Map(files.map((file) => [file.id.value, file]));
    const filesToDelete: FileId[] = [];
    const deletedFileIds: string[] = [];
    const blobUrlsToDelete: string[] = [];

    for (const parsedFileId of parsedFileIds) {
      const file = filesById.get(parsedFileId.value);

      if (!file || !file.isOwnedBy(input.ownerId)) {
        skippedFileIds.push(parsedFileId.value);
        continue;
      }

      blobUrlsToDelete.push(file.blobUrl.value);
      filesToDelete.push(file.id);
      deletedFileIds.push(file.id.value);
    }

    if (blobUrlsToDelete.length > 0) {
      await remove(blobUrlsToDelete);
    }

    if (filesToDelete.length > 0) {
      await this.fileRepository.removeMany(filesToDelete);
    }

    return {
      deletedFileIds,
      skippedFileIds,
    };
  }
}
