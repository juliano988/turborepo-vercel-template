"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { ListUserFilesUseCase } from "../../useCases/ListUserFilesUseCase";
import { requireSession } from "../utils/requireSession";

export async function listFilesAction() {
  const session = await requireSession();

  const repository = new FileRepository();
  const service = new ListUserFilesUseCase(repository);

  return service.execute({ ownerId: UserId.from(session.user.id) });
}
