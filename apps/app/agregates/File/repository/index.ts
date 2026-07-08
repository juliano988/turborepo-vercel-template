import { File } from "..";
import { FileId } from "../vo/FileId";
import { UserId } from "../../User/vo/UserId";

export interface FileRepository {
  save(file: File): Promise<void>;
  findById(id: FileId): Promise<File | null>;
  findByOwner(ownerId: UserId): Promise<File[]>;
  remove(id: FileId): Promise<void>;
}
