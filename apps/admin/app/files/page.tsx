import { File as ActiveFile } from "../../active_records/Files";
import { toPositiveInt } from "../users/modules/toPositiveInt";
import { toSingle } from "../users/modules/toSingle";
import { FilesTableClient } from "./components/FilesTableClient";
import { FileListItem, FilesFilterState, PageProps } from "./types";

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  const page = toPositiveInt(toSingle(params.page), 1);
  const pageSize = toPositiveInt(toSingle(params.pageSize), 10);
  const search = toSingle(params.search)?.trim() ?? "";
  const mimeType = toSingle(params.mimeType)?.trim() ?? "";

  const list = await ActiveFile.list({
    page,
    pageSize,
    search: search || undefined,
    mimeType: mimeType || undefined,
  });

  const dataSource: FileListItem[] = list.data.map((file) => {
    return {
      ...file,
      uploadedAt: file.uploadedAt.toISOString(),
    };
  });

  const filters: FilesFilterState = {
    search,
    mimeType,
  };

  return (
    <FilesTableClient files={dataSource} meta={list.meta} filters={filters} />
  );
}
