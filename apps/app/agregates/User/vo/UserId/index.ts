import type { UserIdValue } from "./types";

export class UserId {
  private constructor(private readonly value: UserIdValue) {}

  static create(): UserId {
    return new UserId(crypto.randomUUID());
  }

  static from(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new Error("UserId não pode ser vazio");
    }
    return new UserId(value.trim());
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
