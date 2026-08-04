import { describe, expect, it } from "vitest";
import { toPositiveInt } from "./toPositiveInt";

describe("toPositiveInt", () => {
  it("retorna inteiro positivo quando válido", () => {
    expect(toPositiveInt("7", 1)).toBe(7);
    expect(toPositiveInt("7.9", 1)).toBe(7);
  });

  it("retorna fallback quando inválido", () => {
    expect(toPositiveInt(undefined, 3)).toBe(3);
    expect(toPositiveInt("0", 3)).toBe(3);
    expect(toPositiveInt("-1", 3)).toBe(3);
    expect(toPositiveInt("abc", 3)).toBe(3);
  });
});
