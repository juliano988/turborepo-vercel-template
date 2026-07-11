"use client";

import { ProLayout } from "@ant-design/pro-components";
import Link from "next/link";
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
      location={{ pathname }}
      route={{ routes: menuRoutes }}
      menuFooterRender={() => <UserFooter />}
      menuItemRender={(item, dom) => {
        if (item.path) {
          return <Link href={item.path}>{dom}</Link>;
        }
        return dom;
      }}
    >
      {children}
    </ProLayout>
  );
}
