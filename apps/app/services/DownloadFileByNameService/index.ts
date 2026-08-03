import type { iFileRepository } from "../../agregates/File/repository";
import { FileName } from "../../agregates/File/vo/FileName";
import type {
  DownloadFileByNameInput,
  DownloadFileByNameOutput,
} from "./types";

export class DownloadFileByNameService {
  constructor(private readonly fileRepository: iFileRepository) {}

  async execute(
    input: DownloadFileByNameInput
  ): Promise<DownloadFileByNameOutput> {
    const fileName = FileName.from(input.filename);
    const file = await this.fileRepository.findByNameAndOwner(fileName, input.ownerId);

    if (!file) {
      return {
        file: null,
        downloadUrl: null,
      };
    }

    return {
      file: file.toJSON(),
      downloadUrl: `/app/api/files/${encodeURIComponent(file.name.full)}`,
    };
  }
}
