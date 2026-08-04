import { describe, expect, it } from "vitest";
import { initials } from "./initials";

describe("initials", () => {
  it("extrai duas iniciais", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
  });

  it("ignora espaços extras", () => {
    expect(initials("  grace   hopper ")).toBe("GH");
  });

  it("limita a duas partes", () => {
    expect(initials("Marie Sklodowska Curie")).toBe("MS");
  });
});
