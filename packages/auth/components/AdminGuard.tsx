"use client";

import { useSession } from "../client";
import { Unauthorized } from "./Unauthorized";

interface AdminGuardProps {
  children: React.ReactNode;
  loginUrl?: string;
}

export function AdminGuard({ children, loginUrl }: AdminGuardProps) {
  const { data: session, isPending } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (isPending) return null;
  if (!session || role !== "admin") {
    return <Unauthorized loginUrl={loginUrl} />;
  }

  return <>{children}</>;
}
