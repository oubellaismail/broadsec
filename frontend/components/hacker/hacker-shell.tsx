"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, FileText, LayoutDashboard, ShieldCheck, Target } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DEMO_HACKER_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/hacker", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hacker/programs", label: "Programs", icon: Target },
  { href: "/hacker/reports", label: "Reports", icon: FileText },
  { href: "/hacker/rewards", label: "Rewards", icon: Award },
];

export function HackerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-blue-700">BroadSec</p>
            <p className="text-xs text-slate-500">Researcher Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
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
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                AC
              </div>
              <div>
                <p className="text-sm font-semibold">{DEMO_HACKER_USER.name}</p>
                <p className="text-xs text-slate-500">{DEMO_HACKER_USER.role}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{DEMO_HACKER_USER.country}</p>
            <SignOutButton className="mt-4 w-full border border-slate-200 bg-white" />
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/hacker" className="flex items-center gap-2 font-semibold text-blue-700 lg:hidden">
              <ShieldCheck className="h-5 w-5" />
              BroadSec
            </Link>
            <nav className="hidden gap-2 sm:flex lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
