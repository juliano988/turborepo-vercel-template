"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { DeleteManyFilesService } from "../../services/DeleteManyFilesService";
import { requireSession } from "./requireSession";

export async function deleteFilesAction(fileIds: string[]) {
  const session = await requireSession();

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return {
      deletedFileIds: [],
      skippedFileIds: [],
    };
  }

  const repository = new FileRepository();
  const service = new DeleteManyFilesService(repository);

  return service.execute({
    ownerId: UserId.from(session.user.id),
    fileIds,
  });
}
