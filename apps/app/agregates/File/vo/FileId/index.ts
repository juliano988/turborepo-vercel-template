import { UUID_REGEX } from "./constants";
import type { FileIdValue } from "./types";

export class FileId {
  private constructor(public readonly value: FileIdValue) {}

  static create(): FileId {
    return new FileId(crypto.randomUUID());
  }

  static from(value: string): FileId {
    if (!value || value.trim().length === 0) {
      throw new Error("FileId não pode ser vazio");
    }
    if (!UUID_REGEX.test(value.trim())) {
      throw new Error("FileId deve ser um UUID válido");
    }
    return new FileId(value.trim());
  }

  equals(other: FileId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
