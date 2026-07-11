import { UsersFilterState, UsersListMeta } from "../../../../../types";

export type UpdateQueryInput = {
  pathname: string;
  push: (href: string) => void;
  meta: UsersListMeta;
  filters: UsersFilterState;
  next: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    emailVerified?: UsersFilterState["emailVerified"];
    banned?: UsersFilterState["banned"];
  };
};
