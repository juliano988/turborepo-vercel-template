import type { iFileRepository } from "../../agregates/File/repository";
import { FileName } from "../../agregates/File/vo/FileName";
import type { iUserRepository } from "../../agregates/User/repository";
import type {
  DownloadFileByNameInput,
  DownloadFileByNameOutput,
} from "./types";

export class DownloadFileByNameUseCase {
  constructor(
    private readonly userRepository: iUserRepository,
    private readonly fileRepository: iFileRepository
  ) {}

  async execute(
    input: DownloadFileByNameInput
  ): Promise<DownloadFileByNameOutput> {
    if (input.apiKey?.trim()) {
      const user = await this.userRepository.findByApiKey(input.apiKey.trim());
      if (!user) {
        return {
          file: null,
          downloadUrl: null,
        };
      }

      input.ownerId = user.id;
    }

    const fileName = FileName.from(input.filename);
    const file = await this.fileRepository.findByNameAndOwner(
      fileName,
      input.ownerId
    );

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
