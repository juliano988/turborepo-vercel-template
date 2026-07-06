import { del } from "@vercel/blob";

/**
 * Remove um ou mais blobs pelo URL ou pathname retornado no upload.
 *
 * @param urls  URL/pathname ou array de URLs/pathnames dos blobs a remover
 */
export async function remove(urls: string | string[]): Promise<void> {
  const targets = Array.isArray(urls) ? urls : [urls];
  await del(targets);
}
