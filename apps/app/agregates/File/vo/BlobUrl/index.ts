import { BLOB_URL_PROTOCOLS } from "./constants";
import type { BlobUrlValue } from "./types";

export class BlobUrl {
  private constructor(public readonly value: BlobUrlValue) {}

  static from(raw: string): BlobUrl {
    if (!raw || raw.trim().length === 0) {
      throw new Error("BlobUrl não pode ser vazio");
    }

    let parsed: URL;
    try {
      parsed = new URL(raw.trim());
    } catch {
      throw new Error(`BlobUrl inválida: "${raw}"`);
    }

    if (!(BLOB_URL_PROTOCOLS as readonly string[]).includes(parsed.protocol)) {
      throw new Error(
        `BlobUrl deve usar protocolo HTTPS`
      );
    }

    return new BlobUrl(parsed.toString());
  }

  equals(other: BlobUrl): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
