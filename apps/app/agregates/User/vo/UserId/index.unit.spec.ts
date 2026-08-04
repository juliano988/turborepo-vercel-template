import { describe, expect, it } from "vitest";
import { UserId } from ".";

describe("UserId", () => {
  it("trim o valor recebido", () => {
    const userId = UserId.from("  user-1  ");

    expect(userId.toString()).toBe("user-1");
  });

  it("compara ids pelo valor", () => {
    expect(UserId.from("user-1").equals(UserId.from("user-1"))).toBe(true);
    expect(UserId.from("user-1").equals(UserId.from("user-2"))).toBe(false);
  });

  it("gera um id nao vazio", () => {
    const userId = UserId.create();

    expect(userId.toString()).not.toHaveLength(0);
  });

  it("rejeita valor vazio", () => {
    expect(() => UserId.from("   ")).toThrow("UserId não pode ser vazio");
  });
});
