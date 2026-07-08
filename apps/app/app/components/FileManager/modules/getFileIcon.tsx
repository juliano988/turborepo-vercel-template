import { File, FileArchive, FileImage, FileText } from "@repo/ui";

export function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <FileImage size={20} />;
  if (type === "application/pdf") return <FileText size={20} />;
  if (type.includes("zip") || type.includes("rar") || type.includes("7z"))
    return <FileArchive size={20} />;
  if (type.includes("word") || type.includes("doc")) return <FileText size={20} />;
  if (type.includes("excel") || type.includes("sheet") || type.includes("csv"))
    return <FileText size={20} />;
  if (type.startsWith("text/")) return <FileText size={20} />;
  return <File size={20} />;
}
