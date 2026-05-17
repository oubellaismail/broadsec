"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { getDemoUser, type DemoRole, type DemoUser } from "@/lib/demo-auth";

interface AuthGateProps {
  children: ReactNode;
  requiredRole: DemoRole;
}

export function AuthGate({ children, requiredRole }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const currentUser = getDemoUser();

    if (!currentUser) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setUser(currentUser);
    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Checking access...
      </div>
    );
  }

  if (!user || user.role !== requiredRole) {
    const isAdminArea = requiredRole === "admin";
    const href = user?.role === "admin" ? "/admin" : "/hacker";
    const label = user?.role === "admin" ? "Go to Admin Console" : "Go to Researcher Portal";

    return (
      <div className={isAdminArea ? "min-h-screen bg-background text-foreground" : "min-h-screen bg-slate-50 text-slate-950"}>
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className={isAdminArea ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300" : "flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"}>
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Access Denied</h1>
          <p className={isAdminArea ? "mt-3 text-muted-foreground" : "mt-3 text-slate-600"}>
            This area is restricted to {requiredRole === "admin" ? "admin users" : "security researchers"}.
          </p>
          <Link
            href={href}
            className={isAdminArea ? "mt-6 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accentHover" : "mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"}
          >
            {label}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
