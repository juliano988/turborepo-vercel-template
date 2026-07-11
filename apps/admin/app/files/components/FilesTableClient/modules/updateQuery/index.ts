import { UpdateQueryInput } from "./types";

export function updateQuery(input: UpdateQueryInput): void {
  const { pathname, push, meta, filters, next } = input;

  const params = new URLSearchParams();

  const page = next.page ?? meta.page;
  const pageSize = next.pageSize ?? meta.pageSize;
  const search = next.search ?? filters.search;
  const mimeType = next.mimeType ?? filters.mimeType;

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (search) {
    params.set("search", search);
  }

  if (mimeType) {
    params.set("mimeType", mimeType);
  }

  push(`${pathname}?${params.toString()}`);
}
