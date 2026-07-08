"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { ListUserFilesService } from "../../services/ListUserFilesService";
import { requireSession } from "./requireSession";

export async function listFilesAction() {
  const session = await requireSession();

  const repository = new FileRepository();
  const service = new ListUserFilesService(repository);

  return service.execute({ ownerId: UserId.from(session.user.id) });
}
