import { ALLOWED_EXTENSIONS, MAX_NAME_LENGTH } from "./constants";
import type { AllowedExtension } from "./types";

export class FileName {
  public readonly base: string;
  public readonly extension: AllowedExtension;

  private constructor(base: string, extension: AllowedExtension) {
    this.base = base;
    this.extension = extension;
  }

  static from(raw: string): FileName {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new Error("Nome do arquivo não pode ser vazio");
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new Error(
        `Nome do arquivo não pode ter mais de ${MAX_NAME_LENGTH} caracteres`
      );
    }

    const dotIndex = trimmed.lastIndexOf(".");
    if (dotIndex <= 0) {
      throw new Error("Arquivo deve ter uma extensão");
    }

    const base = trimmed.slice(0, dotIndex);
    const ext = trimmed.slice(dotIndex + 1).toLowerCase();

    if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
      throw new Error(`Extensão ".${ext}" não é permitida`);
    }

    return new FileName(base, ext as AllowedExtension);
  }

  get full(): string {
    return `${this.base}.${this.extension}`;
  }

  equals(other: FileName): boolean {
    return this.full === other.full;
  }

  toString(): string {
    return this.full;
  }
}
