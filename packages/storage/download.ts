import { getDownloadUrl } from "@vercel/blob";

/**
 * Retorna a URL de download de um blob com `Content-Disposition: attachment`.
 *
 * @param blobUrl  URL do blob retornado pelo upload
 */
export function getFileDownloadUrl(blobUrl: string): string {
  return getDownloadUrl(blobUrl);
}
