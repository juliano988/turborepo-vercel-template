import { UpdateQueryInput } from "./types";

export function updateQuery(input: UpdateQueryInput): void {
  const { pathname, push, meta, filters, next } = input;

  const params = new URLSearchParams();

  const page = next.page ?? meta.page;
  const pageSize = next.pageSize ?? meta.pageSize;
  const search = next.search ?? filters.search;
  const role = next.role ?? filters.role;
  const emailVerified = next.emailVerified ?? filters.emailVerified;
  const banned = next.banned ?? filters.banned;

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (search) {
    params.set("search", search);
  }

  if (role) {
    params.set("role", role);
  }

  if (emailVerified !== "all") {
    params.set("emailVerified", emailVerified);
  }

  if (banned !== "all") {
    params.set("banned", banned);
  }

  push(`${pathname}?${params.toString()}`);
}
