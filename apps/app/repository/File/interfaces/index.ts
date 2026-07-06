import { File } from "../../../agregates/File";
import { FileId } from "../../../agregates/File/vo/FileId";
import { UserId } from "../../../agregates/User/vo/UserId";

export interface FileRepository {
  save(file: File): Promise<void>;
  findById(id: FileId): Promise<File | null>;
  findByOwner(ownerId: UserId): Promise<File[]>;
  remove(id: FileId): Promise<void>;
}
