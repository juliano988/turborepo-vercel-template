import type { StoredFile } from "../../../types";

export interface DoneListProps {
  files: StoredFile[];
  onRemove: (uid: string) => void;
  onCopyLink: (uid: string) => void;
}
