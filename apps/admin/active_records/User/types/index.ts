import { User } from "@repo/auth";

export type UserProps = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
};

export type UserListInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  emailVerified?: boolean;
  banned?: boolean;
};

export type UserListOutput = {
  data: User[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
