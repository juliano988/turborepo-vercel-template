import { describe, expect, it } from "vitest";
import { FileName } from ".";

describe("FileName", () => {
  it("normaliza o nome e a extensao", () => {
    const fileName = FileName.from("  Report.PDF  ");

    expect(fileName.base).toBe("Report");
    expect(fileName.extension).toBe("pdf");
    expect(fileName.full).toBe("Report.pdf");
    expect(fileName.toString()).toBe("Report.pdf");
  });

  it("compara arquivos pelo nome completo", () => {
    const left = FileName.from("report.pdf");
    const right = FileName.from("report.PDF");

    expect(left.equals(right)).toBe(true);
  });

  it("rejeita nome vazio", () => {
    expect(() => FileName.from("   ")).toThrow("Nome do arquivo não pode ser vazio");
  });

  it("rejeita arquivo sem extensao", () => {
    expect(() => FileName.from("report")).toThrow("Arquivo deve ter uma extensão");
  });

  it("rejeita extensao nao permitida", () => {
    expect(() => FileName.from("report.exe")).toThrow('Extensão ".exe" não é permitida');
  });
});
