import type { StoredFile } from "../../../types";

export interface UploadingListProps {
  files: StoredFile[];
  isPending: boolean;
}
