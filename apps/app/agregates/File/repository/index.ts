import { File } from "..";
import { UserId } from "../../User/vo/UserId";
import { FileId } from "../vo/FileId";

export interface iFileRepository {
  save(file: File): Promise<void>;
  findById(id: FileId): Promise<File | null>;
  findByIds(ids: FileId[]): Promise<File[]>;
  findByOwner(ownerId: UserId): Promise<File[]>;
  remove(id: FileId): Promise<void>;
  removeMany(ids: FileId[]): Promise<void>;
}
