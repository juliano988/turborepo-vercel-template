export type UserListItem = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
};

export type UsersListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type UsersFilterState = {
  search: string;
  role: string;
  emailVerified: "all" | "true" | "false";
  banned: "all" | "true" | "false";
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type PageProps = {
  searchParams?: Promise<SearchParams>;
};
