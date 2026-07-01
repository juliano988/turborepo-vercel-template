"use client";

import { useSession } from "../client";
import { Unauthorized } from "./Unauthorized";

interface AuthGuardProps {
  children: React.ReactNode;
  loginUrl?: string;
}

export function AuthGuard({ children, loginUrl }: AuthGuardProps) {
  const { data: session, isPending } = useSession();

  if (isPending) return null;
  if (!session) return <Unauthorized loginUrl={loginUrl} />;

  return <>{children}</>;
}
