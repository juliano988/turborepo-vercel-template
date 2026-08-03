import { File } from "..";
import { UserId } from "../../User/vo/UserId";
import { FileId } from "../vo/FileId";
import { FileName } from "../vo/FileName";

export interface iFileRepository {
  save(file: File): Promise<void>;
  saveMany(files: File[]): Promise<void>;
  findById(id: FileId): Promise<File | null>;
  findByIds(ids: FileId[]): Promise<File[]>;
  findByOwner(ownerId: UserId): Promise<File[]>;
  findByNameAndOwner(name: FileName, ownerId: UserId): Promise<File | null>;
  remove(id: FileId): Promise<void>;
  removeMany(ids: FileId[]): Promise<void>;
}
