"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearDemoUser } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  variant?: "light" | "dark";
}

export function SignOutButton({ className, variant = "light" }: SignOutButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        clearDemoUser();
        router.push("/login");
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
        variant === "dark"
          ? "text-muted-foreground hover:bg-accentHover hover:text-white"
          : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
        className
      )}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
