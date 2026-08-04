import { ApiKeyValue } from "./types";

export class ApiKey {
  private constructor(private readonly value: ApiKeyValue) {}

  static from(value: string | null | undefined): ApiKey | null {
    if (!value || value.trim().length === 0) {
      return null;
    }

    return new ApiKey(value.trim());
  }

  equals(other: ApiKey): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
