import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
} from "@/components/ai/search";
import { cn } from "@/lib/cn";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { ThemeProviderFumaDocs } from "@repo/ui";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { MessageCircleIcon } from "lucide-react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export default async function Layout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const defaultTheme = cookieStore.get("theme-preference")?.value ?? "light";

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ThemeProviderFumaDocs defaultTheme={defaultTheme}>
          <RootProvider theme={{ enabled: false }}>
            <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
              <AISearch>
                <AISearchPanel />
                <AISearchTrigger
                  position="float"
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      className: "text-fd-muted-foreground rounded-2xl",
                    }),
                  )}
                >
                  <MessageCircleIcon className="size-4.5" />
                  Ask AI
                </AISearchTrigger>
              </AISearch>
              {children}
            </DocsLayout>
          </RootProvider>
        </ThemeProviderFumaDocs>
      </body>
    </html>
  );
}
