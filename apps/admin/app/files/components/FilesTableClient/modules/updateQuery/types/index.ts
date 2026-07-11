export type FilesListMeta = {
  page: number;
  pageSize: number;
};

export type FilesFilterState = {
  search: string;
  mimeType: string;
};

export type FilesFilterPatch = Partial<
  FilesFilterState & {
    page: number;
    pageSize: number;
  }
>;

export type UpdateQueryInput = {
  pathname: string;
  push: (href: string) => void;
  meta: FilesListMeta;
  filters: FilesFilterState;
  next: FilesFilterPatch;
};
