export const ALLOWED_MIME_TYPES = [
  // Imagens
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // PDF
  "application/pdf",
  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // PowerPoint
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Texto
  "text/plain",
  "text/markdown",
  "text/csv",
  // Arquivos comprimidos
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
  // Vídeo
  "video/mp4",
  // Áudio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
] as const;
