import { formatHex, parse } from "culori";

export default function oklchToHex(str: string): string {
  const color = parse(str);
  return color ? (formatHex(color) ?? "#000000") : "#000000";
}
