import type { iFileRepository } from "../../agregates/File/repository";
import { ListUserFilesInput, ListUserFilesOutput } from "./types";

export class ListUserFilesService {
  constructor(private readonly fileRepository: iFileRepository) {}

  async execute(input: ListUserFilesInput): Promise<ListUserFilesOutput> {
    const files = await this.fileRepository.findByOwner(input.ownerId);

    return files.map((file) => file.toJSON());
  }
}
