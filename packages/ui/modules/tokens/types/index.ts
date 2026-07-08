import { ThemeConfig } from "antd";

export type Token = NonNullable<ThemeConfig["token"]>;

export type ScrollbarTokens = {
  containerBorder: string;
  containerBackground: string;
  containerRadius: number;
  track: string;
  thumb: string;
  thumbHover: string;
};
