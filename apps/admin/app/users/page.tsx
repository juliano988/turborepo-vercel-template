import { User } from "../../active_records/User";
import { UsersTableClient } from "./components/UsersTableClient";
import { toBool } from "./modules/toBool";
import { toPositiveInt } from "./modules/toPositiveInt";
import { toSingle } from "./modules/toSingle";
import { PageProps, UserListItem, UsersFilterState } from "./types";

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};

  const page = toPositiveInt(toSingle(params.page), 1);
  const pageSize = toPositiveInt(toSingle(params.pageSize), 10);
  const search = toSingle(params.search)?.trim() ?? "";
  const role = toSingle(params.role)?.trim() ?? "";
  const emailVerifiedRaw = toSingle(params.emailVerified) ?? "all";
  const bannedRaw = toSingle(params.banned) ?? "all";

  const list = await User.list({
    page,
    pageSize,
    search: search || undefined,
    role: role || undefined,
    emailVerified: toBool(emailVerifiedRaw),
    banned: toBool(bannedRaw),
  });

  const dataSource: UserListItem[] = list.data.map((user) => {
    return {
      ...user,
      image: user.image ?? null,
      role: user.role ?? null,
      banned: user.banned ?? null,
      banReason: user.banReason ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      banExpires: user.banExpires?.toISOString() ?? null,
    };
  });

  const filters: UsersFilterState = {
    search,
    role,
    emailVerified:
      emailVerifiedRaw === "true" || emailVerifiedRaw === "false"
        ? emailVerifiedRaw
        : "all",
    banned: bannedRaw === "true" || bannedRaw === "false" ? bannedRaw : "all",
  };

  return (
    <UsersTableClient users={dataSource} meta={list.meta} filters={filters} />
  );
}
