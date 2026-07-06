import { head, type HeadBlobResult } from "@vercel/blob";

export type { HeadBlobResult };

/**
 * Retorna os metadados de um blob pelo seu URL ou pathname.
 * Retorna `null` se o blob não existir.
 */
export async function getMetadata(
  urlOrPathname: string
): Promise<HeadBlobResult | null> {
  try {
    return await head(urlOrPathname);
  } catch {
    return null;
  }
}
