import { ALLOWED_MIME_TYPES } from "./constants";
import type { MimeTypeValue } from "./types";

export class MimeType {
  private constructor(public readonly value: MimeTypeValue) {}

  static from(raw: string): MimeType {
    if (!raw || raw.trim().length === 0) {
      throw new Error("MIME type não pode ser vazio");
    }

    const normalized = raw.trim().toLowerCase() as MimeTypeValue;

    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(normalized)) {
      throw new Error(`MIME type "${normalized}" não é permitido`);
    }

    return new MimeType(normalized);
  }

  equals(other: MimeType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
