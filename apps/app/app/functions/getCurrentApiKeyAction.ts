"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { UserRepository } from "../../repository/User";
import { requireSession } from "./requireSession";

export async function getCurrentApiKeyAction() {
  const session = await requireSession();

  const repository = new UserRepository();
  const user = await repository.findById(UserId.from(session.user.id));

  return user?.apiKey?.toString() ?? null;
}
