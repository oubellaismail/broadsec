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

export default function DashboardSidebar({
  activeView,
}: DashboardSidebarProps) {
  const { state, setOpenMobile } = useSidebar();

  const commonButtonClass =
    "hover:bg-accentHover hover:text-white transition-colors";

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="bg-sidebarBg">
      <SidebarHeader className="flex justify-center py-5 md:items-center">
        <div
          className={cn(
            "flex gap-2 text-white transition-all",
            state === "collapsed" ? "justify-center" : "items-center px-4"
          )}
        >
          <Shield className="h-6 w-6 text-accent" />
          {state === "expanded" && (
            <div className="leading-tight">
              <span className="block text-lg font-bold">BroadSec</span>
              <span className="text-xs text-muted-foreground">Admin Console</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="mt-3 px-2">
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
                    commonButtonClass,
                    isActive && "bg-accent text-white hover:bg-accentHover"
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
      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" className={commonButtonClass}>
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
            "flex items-center gap-2 py-4 text-white transition-all",
            state === "collapsed" ? "justify-center" : "justify-start"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">BroadSec Admin</span>
              <span className="text-xs text-[#A1A1AA]">admin@broadsec.demo</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
