import { FILE_TYPE_COLORS } from "../constants";

export function getFileColor(type: string): string {
  if (type.startsWith("image/")) return FILE_TYPE_COLORS.image;
  if (type === "application/pdf") return FILE_TYPE_COLORS.pdf;
  if (type.includes("zip") || type.includes("rar") || type.includes("7z"))
    return FILE_TYPE_COLORS.archive;
  if (type.includes("word") || type.includes("doc"))
    return FILE_TYPE_COLORS.word;
  if (type.includes("excel") || type.includes("sheet") || type.includes("csv"))
    return FILE_TYPE_COLORS.excel;
  if (type.startsWith("text/")) return FILE_TYPE_COLORS.text;
  return FILE_TYPE_COLORS.default;
}
