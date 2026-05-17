"use client";

import { Search, Server } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
  const meta = pageMeta[activeView];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <SidebarTrigger />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{meta.title}</h1>
            <p className="hidden truncate text-xs text-muted-foreground md:block">
              {meta.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "hidden gap-2 border md:inline-flex",
              isFallback
                ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            )}
            title={isFallback ? "Using mock fallback data" : `${health.service} ${health.version}`}
          >
            <Server className="h-3.5 w-3.5" />
            {isLoading ? "Checking API" : isFallback ? "Mock fallback" : "API online"}
          </Badge>
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={globalSearch}
              onChange={(event) => onGlobalSearchChange(event.target.value)}
              placeholder="Search reports, domains, reporters..."
              className="w-80 rounded-md bg-inputBg pl-8 text-sm"
            />
          </div>
          <Avatar>
            <AvatarImage src="" alt="User" />
            <AvatarFallback>BS</AvatarFallback>
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
    <div className="max-w-3xl rounded-lg border border-border bg-cardBg p-6">
      <h2 className="text-xl font-bold">Admin Settings</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Demo authentication is enabled for this hackathon build. Real account,
        organization, and permission settings will be connected later.
      </p>
    </div>
  );
}
