export type FileListItem = {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  ownerId: string;
  blobUrl: string;
  uploadedAt: string;
};

export type FilesListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type FilesFilterState = {
  search: string;
  mimeType: string;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type PageProps = {
  searchParams?: Promise<SearchParams>;
};
