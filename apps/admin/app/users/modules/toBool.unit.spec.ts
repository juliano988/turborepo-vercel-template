import { describe, expect, it } from "vitest";
import { toBool } from "./toBool";

describe("toBool", () => {
  it("retorna true para string true", () => {
    expect(toBool("true")).toBe(true);
  });

  it("retorna false para string false", () => {
    expect(toBool("false")).toBe(false);
  });

  it("retorna undefined para valores não mapeados", () => {
    expect(toBool("1")).toBeUndefined();
    expect(toBool("")).toBeUndefined();
    expect(toBool(undefined)).toBeUndefined();
  });
});
