import { describe, expect, it } from "vitest";
import { toSingle } from "./toSingle";

describe("toSingle", () => {
  it("retorna o próprio valor quando string", () => {
    expect(toSingle("abc")).toBe("abc");
  });

  it("retorna primeiro elemento quando array", () => {
    expect(toSingle(["a", "b"])).toBe("a");
  });

  it("retorna undefined para entrada indefinida", () => {
    expect(toSingle(undefined)).toBeUndefined();
  });
});
