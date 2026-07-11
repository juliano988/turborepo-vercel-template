"use client";

import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

export default function AntdLocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfigProvider locale={ptBR}>{children}</ConfigProvider>;
}
