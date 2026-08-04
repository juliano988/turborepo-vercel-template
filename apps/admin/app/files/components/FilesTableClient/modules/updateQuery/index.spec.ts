import { describe, expect, it, vi } from "vitest";
import { updateQuery } from ".";

describe("files/updateQuery", () => {
  it("monta query usando next e fallback", () => {
    const push = vi.fn();

    updateQuery({
      pathname: "/admin/files",
      push,
      meta: { page: 1, pageSize: 10 },
      filters: { search: "", mimeType: "" },
      next: { page: 2, search: "relatorio", mimeType: "application/pdf" },
    });

    expect(push).toHaveBeenCalledWith(
      "/admin/files?page=2&pageSize=10&search=relatorio&mimeType=application%2Fpdf"
    );
  });

  it("omite filtros vazios", () => {
    const push = vi.fn();

    updateQuery({
      pathname: "/admin/files",
      push,
      meta: { page: 4, pageSize: 50 },
      filters: { search: "", mimeType: "" },
      next: {},
    });

    expect(push).toHaveBeenCalledWith("/admin/files?page=4&pageSize=50");
  });
});
