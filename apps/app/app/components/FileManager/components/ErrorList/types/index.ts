import type { StoredFile } from "../../../types";

export interface ErrorListProps {
  files: StoredFile[];
  onRemove: (uid: string) => void;
}
