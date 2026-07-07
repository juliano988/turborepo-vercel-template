import { File } from "..";
import { FileId } from "../vo/FileId";

export interface FileRepository {
  save(file: File): Promise<void>;
  findById(id: FileId): Promise<File | null>;
  findByOwner(ownerId: string): Promise<File[]>;
  remove(id: FileId): Promise<void>;
}
