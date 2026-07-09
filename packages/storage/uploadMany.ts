import type { PutBlobResult } from "@vercel/blob";

import { upload, type UploadOptions } from "./upload";

export type UploadManyItem = {
  filename: string;
  body: Parameters<typeof upload>[1];
  options?: UploadOptions;
};

export type UploadManyFailure = {
  item: UploadManyItem;
  error: unknown;
};

export type UploadManySuccess = {
  item: UploadManyItem;
  blob: PutBlobResult;
};

export type UploadManyResult = {
  successes: UploadManySuccess[];
  failures: UploadManyFailure[];
};

export type UploadManyOptions = {
  /** Quantidade máxima de uploads concorrentes por lote. @defaultvalue 5 */
  chunkSize?: number;
  /** Quando true, interrompe no primeiro erro encontrado. @defaultvalue false */
  failFast?: boolean;
};

/**
 * Faz upload de vários arquivos no Vercel Blob em paralelo por chunks.
 *
 * Cada arquivo usa internamente o helper `upload()`, preservando opções
 * como `folder`, `access`, `multipart`, etc.
 */
export async function uploadMany(
  items: UploadManyItem[],
  options: UploadManyOptions = {}
): Promise<UploadManyResult> {
  const chunkSize = options.chunkSize ?? 5;
  const failFast = options.failFast ?? false;

  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error("uploadMany: 'chunkSize' deve ser um inteiro maior que 0.");
  }

  const successes: UploadManySuccess[] = [];
  const failures: UploadManyFailure[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    if (failFast) {
      const results = await Promise.all(
        chunk.map((item) => upload(item.filename, item.body, item.options))
      );

      successes.push(
        ...results.map((blob, index) => ({
          item: chunk[index] as UploadManyItem,
          blob,
        }))
      );
      continue;
    }

    const settled = await Promise.allSettled(
      chunk.map((item) => upload(item.filename, item.body, item.options))
    );

    settled.forEach((result, index) => {
      const item = chunk[index];

      if (!item) {
        return;
      }

      if (result.status === "fulfilled") {
        successes.push({ item, blob: result.value });
      } else {
        failures.push({ item, error: result.reason });
      }
    });
  }

  return { successes, failures };
}
