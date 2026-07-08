import { MAX_BYTES, MIN_BYTES } from "./constants";
import { FileSizeUnit } from "./types";

export class FileSize {
  private constructor(private readonly bytes: number) {}

  static from(bytes: number): FileSize {
    if (!Number.isFinite(bytes) || bytes < 0) {
      throw new Error("Tamanho do arquivo inválido");
    }
    if (bytes < MIN_BYTES) {
      throw new Error("Arquivo não pode estar vazio");
    }
    if (bytes > MAX_BYTES) {
      throw new Error(
        `Arquivo excede o limite de ${FileSize.format(MAX_BYTES)}`
      );
    }
    return new FileSize(bytes);
  }

  private static format(bytes: number): string {
    const units: FileSizeUnit[] = ["GB", "MB", "KB", "B"];
    const thresholds = [1024 ** 3, 1024 ** 2, 1024, 1];

    for (let i = 0; i < units.length; i++) {
      const threshold = thresholds[i]!;
      if (bytes >= threshold) {
        return `${(bytes / threshold).toFixed(1)} ${units[i]}`;
      }
    }
    return `${bytes} B`;
  }

  get formatted(): string {
    return FileSize.format(this.bytes);
  }

  equals(other: FileSize): boolean {
    return this.bytes === other.bytes;
  }

  toBytes(): number {
    return this.bytes;
  }

  toString(): string {
    return this.formatted;
  }
}
