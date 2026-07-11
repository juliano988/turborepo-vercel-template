"use client";

import { ProLayout } from "@ant-design/pro-components";
import { usePathname } from "next/navigation";
import { menuRoutes } from "./constants";
import UserFooter from "./UserFooter";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ProLayout
      title="Admin"
      logo={false}
      layout="side"
      location={{ pathname }}
      route={{
        path: "/",
        routes: menuRoutes,
      }}
      menuFooterRender={() => <UserFooter />}
    >
      {children}
    </ProLayout>
  );
}
