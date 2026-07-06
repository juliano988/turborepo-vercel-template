import {
  list,
  type ListBlobResult,
  type ListBlobResultBlob,
} from "@vercel/blob";

export type { ListBlobResult, ListBlobResultBlob };

/**
 * Lista blobs armazenados, opcionalmente filtrados por prefixo.
 *
 * @param prefix  Prefixo de caminho para filtrar (ex: "users/123/")
 */
export async function listFiles(prefix?: string): Promise<ListBlobResult> {
  return list({ prefix, mode: "expanded" });
}
