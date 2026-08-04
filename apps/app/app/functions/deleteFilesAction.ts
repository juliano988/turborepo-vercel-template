"use server";

import { UserId } from "../../agregates/User/vo/UserId";
import { FileRepository } from "../../repository/File";
import { DeleteManyFilesUseCase } from "../../useCases/DeleteManyFilesUseCase";
import { requireSession } from "../utils/requireSession";

export async function deleteFilesAction(fileIds: string[]) {
  const session = await requireSession();

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return {
      deletedFileIds: [],
      skippedFileIds: [],
    };
  }

  const repository = new FileRepository();
  const service = new DeleteManyFilesUseCase(repository);

  return service.execute({
    ownerId: UserId.from(session.user.id),
    fileIds,
  });
}
