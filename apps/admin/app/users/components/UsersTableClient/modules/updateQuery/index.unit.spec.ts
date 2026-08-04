import { describe, expect, it, vi } from "vitest";
import { updateQuery } from ".";

describe("users/updateQuery", () => {
  it("monta query com fallback em meta e filtros", () => {
    const push = vi.fn();

    updateQuery({
      pathname: "/admin/users",
      push,
      meta: { page: 2, pageSize: 25, total: 100, totalPages: 4 },
      filters: {
        search: "ana",
        role: "admin",
        emailVerified: "true",
        banned: "all",
      },
      next: {},
    });

    expect(push).toHaveBeenCalledWith(
      "/admin/users?page=2&pageSize=25&search=ana&role=admin&emailVerified=true"
    );
  });

  it("remove filtros opcionais quando setados para vazio/all", () => {
    const push = vi.fn();

    updateQuery({
      pathname: "/admin/users",
      push,
      meta: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
      filters: {
        search: "",
        role: "",
        emailVerified: "all",
        banned: "all",
      },
      next: { page: 3, banned: "false" },
    });

    expect(push).toHaveBeenCalledWith(
      "/admin/users?page=3&pageSize=10&banned=false"
    );
  });
});
