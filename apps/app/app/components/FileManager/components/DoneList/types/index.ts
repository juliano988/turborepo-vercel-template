import type { StoredFile } from "../../../types";

export interface DoneListProps {
  files: StoredFile[];
  onRemove: (uid: string) => void;
  onDownloadFile: (uid: string) => void;
}
