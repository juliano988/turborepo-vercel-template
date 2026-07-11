import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AdminGuard, AuthGuard } from "@repo/auth/components";
import { AntdLocaleProvider, ThemeProviderAntd } from "@repo/ui";
import type { Metadata } from "next";
import AdminShell from "./components/AdminShell";

export const metadata: Metadata = {
  title: "Template Admin",
  description: "Base administrativa com Ant Design ProLayout.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <ThemeProviderAntd>
            <AntdLocaleProvider>
              <AuthGuard>
                <AdminGuard>
                  <AdminShell>{children}</AdminShell>
                </AdminGuard>
              </AuthGuard>
            </AntdLocaleProvider>
          </ThemeProviderAntd>
        </AntdRegistry>
      </body>
    </html>
  );
}
