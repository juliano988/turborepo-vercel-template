export interface UploadZoneProps {
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onBeforeUpload: (file: globalThis.File) => false;
}
