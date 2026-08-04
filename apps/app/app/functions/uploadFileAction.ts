"use server";

import createFileAddedEvent from "../../events/file.added";
import { FileRepository } from "../../repository/File";
import { UploadManyFilesUseCase } from "../../useCases/UploadManyFilesUseCase";
import type { UploadManyFilesOutput } from "../../useCases/UploadManyFilesUseCase/types";
import { requireSession } from "../utils/requireSession";

export async function uploadFileAction(formData: FormData) {
  const session = await requireSession();

  const files: globalThis.File[] = formData
    .getAll("file")
    .filter(
      (value): value is globalThis.File => value instanceof globalThis.File
    );

  if (files.length === 0) {
    throw new Error("Nenhum arquivo enviado");
  }

  const repository = new FileRepository();
  const service = new UploadManyFilesUseCase(repository);

  const result: UploadManyFilesOutput = await service.execute({
    files: files.map((file) => ({
      filename: file.name,
      body: file,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
    })),
    ownerId: session.user.id,
  });

  await Promise.allSettled(result.uploadedFiles.map(createFileAddedEvent));

  return result;
}
