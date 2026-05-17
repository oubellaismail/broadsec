"use client";

import Link from "next/link";
import {
  Bot,
  Building2,
  Home,
  ScanLine,
  Settings,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { getDemoUser } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";
import type { DashboardView } from "./dashboard";

interface DashboardSidebarProps {
  activeView: DashboardView;
}

const navItems: Array<{
  id: DashboardView;
  label: string;
  icon: typeof Home;
  href: string;
}> = [
  { id: "overview", label: "Overview", icon: Home, href: "/admin" },
  { id: "reports", label: "Reports", icon: ShieldAlert, href: "/admin/reports" },
  { id: "programs", label: "Programs", icon: Building2, href: "/admin/programs" },
  { id: "ai", label: "AI Triage", icon: Bot, href: "/admin/ai-triage" },
  { id: "scanner", label: "Scanner", icon: ScanLine, href: "/admin/scanner" },
];

export default function DashboardSidebar({ activeView }: DashboardSidebarProps) {
  const { state, setOpenMobile } = useSidebar();
  const user = getDemoUser();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "BS";

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-white/8 bg-[#0e0b08]"
    >
      {/* Brand */}
      <SidebarHeader className="py-5">
        <div
          className={cn(
            "flex gap-2.5 text-white transition-all",
            state === "collapsed" ? "justify-center" : "items-center px-3"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4A017]/15 text-[#D4A017]">
            <Shield className="h-4 w-4" />
          </div>
          {state === "expanded" && (
            <div className="leading-tight">
              <span className="block text-sm font-bold text-white">BroadSec</span>
              <span className="block text-xs text-white/40">Admin Console</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/8" />

      {/* Nav */}
      <SidebarContent className="mt-2 px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={isActive}
                  className={cn(
                    "transition-colors text-white/55 hover:bg-white/5 hover:text-white",
                    isActive &&
                      "bg-[#D4A017]/15 text-[#D4A017] hover:bg-[#D4A017]/20 hover:text-[#D4A017]"
                  )}
                >
                  <Link href={item.href} onClick={() => setOpenMobile(false)}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="mt-auto border-t border-white/8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="text-white/55 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Link href="/admin/settings" onClick={() => setOpenMobile(false)}>
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SignOutButton variant="dark" className="w-full justify-start" />
          </SidebarMenuItem>
        </SidebarMenu>

        <div
          className={cn(
            "flex items-center gap-2.5 py-3 px-1 transition-all",
            state === "collapsed" ? "justify-center" : "justify-start"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="" alt={user?.name} />
            <AvatarFallback className="bg-[#D4A017]/15 text-[#D4A017] text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-white">
                {user?.name ?? "BroadSec Admin"}
              </span>
              <span className="truncate text-xs text-white/40">
                {user?.email ?? "admin@broadsec.demo"}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
