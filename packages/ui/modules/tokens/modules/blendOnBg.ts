import { converter, formatHex, parse } from "culori";

const toRgb = converter("rgb");

export default function blendOnBg(
  fg: string,
  bg: string,
  alpha: number
): string {
  const fgRgb = toRgb(parse(fg));
  const bgRgb = toRgb(parse(bg));
  if (!fgRgb || !bgRgb) return "#000000";
  return (
    formatHex({
      mode: "rgb",
      r: (fgRgb.r ?? 0) * alpha + (bgRgb.r ?? 0) * (1 - alpha),
      g: (fgRgb.g ?? 0) * alpha + (bgRgb.g ?? 0) * (1 - alpha),
      b: (fgRgb.b ?? 0) * alpha + (bgRgb.b ?? 0) * (1 - alpha),
    }) ?? "#000000"
  );
}
