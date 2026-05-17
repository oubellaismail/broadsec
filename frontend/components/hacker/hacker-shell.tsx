"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, FileText, LayoutDashboard, Menu, Shield, Target } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDemoUser } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/hacker", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hacker/programs", label: "Programs", icon: Target },
  { href: "/hacker/reports", label: "Reports", icon: FileText },
  { href: "/hacker/rewards", label: "Rewards", icon: Award },
];

export function HackerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getDemoUser();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "BS";

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/8 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4A017]/15 text-[#D4A017]">
          <Shield className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">BroadSec</p>
          <p className="text-xs text-white/40">Researcher Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/hacker"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#D4A017]/15 text-[#D4A017]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: user + sign out */}
      <div className="border-t border-white/8 p-3 space-y-1">
        <SignOutButton variant="dark" className="w-full justify-start" />
        <div className="flex items-center gap-2.5 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-[#D4A017]/15 text-[#D4A017] text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name ?? "Researcher"}</p>
            <p className="truncate text-xs text-white/40">{user?.email ?? "researcher@broadsec.demo"}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-[#0e0b08] border-r border-white/8 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#0e0b08] border-r border-white/8 transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-white/8 bg-[#080604]/90 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Shield className="h-4 w-4 text-[#D4A017] lg:hidden" />
          <span className="text-sm font-semibold text-white lg:hidden">BroadSec</span>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
