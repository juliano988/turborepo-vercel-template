import { describe, expect, it } from "vitest";
import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("formata bytes puros", () => {
    expect(formatBytes(999)).toBe("999 B");
  });

  it("formata em KB/MB", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
  });

  it("retorna hífen para valores inválidos", () => {
    expect(formatBytes(-1)).toBe("-");
    expect(formatBytes(Number.NaN)).toBe("-");
  });
});
