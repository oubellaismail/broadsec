import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/auth-gate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AuthGate requiredRole="admin">{children}</AuthGate>;
}
