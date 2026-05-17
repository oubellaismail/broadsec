"use client";

import { Search, Server } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AiTriageView } from "@/components/broadsec/ai-triage-view";
import { ProgramsView } from "@/components/broadsec/programs-view";
import { ReportsView } from "@/components/broadsec/reports-view";
import { ScannerView } from "@/components/broadsec/scanner-view";
import { DashboardWidgets } from "./dashboard-widgets";
import { useApiHealth } from "@/hooks/use-api-health";
import { cn } from "@/lib/utils";
import type { DashboardView } from "./dashboard";

const pageMeta: Record<DashboardView, { title: string; subtitle: string }> = {
  overview: {
    title: "BroadSec Overview",
    subtitle: "Bug bounty operations, triage throughput, and bounty exposure.",
  },
  reports: {
    title: "Reports / Vulnerabilities",
    subtitle: "Filter, inspect, triage, duplicate, and resolve researcher reports.",
  },
  programs: {
    title: "Programs / Targets",
    subtitle: "Active Moroccan demo programs, scope, and MAD bounty ranges.",
  },
  ai: {
    title: "AI Triage",
    subtitle: "Run triage, report writing, and translation through API.md endpoints.",
  },
  scanner: {
    title: "Scanner",
    subtitle: "Header and SSL scan workflow backed by the documented scanner API.",
  },
  settings: {
    title: "Settings",
    subtitle: "Demo admin session settings and console preferences.",
  },
};

interface DashboardContentProps {
  activeView: DashboardView;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
}

export default function DashboardContent({
  activeView,
  globalSearch,
  onGlobalSearchChange,
}: DashboardContentProps) {
  const { health, isLoading, isFallback } = useApiHealth();
  const { state, isMobile } = useSidebar();
  const meta = pageMeta[activeView];

  const marginLeft = isMobile
    ? 0
    : state === "expanded"
    ? "var(--sidebar-width)"
    : "var(--sidebar-width-icon)";

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden min-h-svh bg-background text-foreground transition-[margin-left] duration-200 ease-linear"
      style={{ marginLeft }}
    >
      <header className="flex h-14 items-center justify-between border-b border-white/8 bg-[#080604]/90 px-4 backdrop-blur md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="text-white/50 hover:bg-white/5 hover:text-white" />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white">{meta.title}</h1>
            <p className="hidden truncate text-xs text-white/40 md:block">
              {meta.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "hidden gap-1.5 border text-xs md:inline-flex",
              isFallback
                ? "border-[#C0533A]/30 bg-[#C0533A]/10 text-[#C0533A]"
                : "border-[#1F6B35]/40 bg-[#1F6B35]/10 text-[#4ade80]"
            )}
            title={isFallback ? "Using mock fallback data" : `${health.service} ${health.version}`}
          >
            <Server className="h-3 w-3" />
            {isLoading ? "Checking API" : isFallback ? "Mock fallback" : "API online"}
          </Badge>
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/30" />
            <Input
              type="search"
              value={globalSearch}
              onChange={(event) => onGlobalSearchChange(event.target.value)}
              placeholder="Search reports, domains, reporters..."
              className="w-72 rounded-xl border-white/10 bg-white/5 pl-8 text-sm text-white placeholder:text-white/25 focus-visible:border-[#D4A017]/40 focus-visible:ring-0"
            />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-[#D4A017]/15 text-[#D4A017] text-xs font-semibold">
              BS
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
        {activeView === "overview" ? <DashboardWidgets /> : null}
        {activeView === "reports" ? (
          <ReportsView globalSearch={globalSearch} />
        ) : null}
        {activeView === "programs" ? <ProgramsView /> : null}
        {activeView === "ai" ? <AiTriageView /> : null}
        {activeView === "scanner" ? <ScannerView /> : null}
        {activeView === "settings" ? <AdminSettingsView /> : null}
      </main>
    </div>
  );
}

function AdminSettingsView() {
  return (
    <div className="max-w-3xl rounded-xl border border-white/8 bg-white/3 p-6">
      <h2 className="text-xl font-bold">Admin Settings</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Demo authentication is enabled for this hackathon build. Real account,
        organization, and permission settings will be connected later.
      </p>
    </div>
  );
}
