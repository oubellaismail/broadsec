import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { HackerShell } from "@/components/hacker/hacker-shell";

export default function HackerLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate requiredRole="researcher">
      <HackerShell>{children}</HackerShell>
    </AuthGate>
  );
}
