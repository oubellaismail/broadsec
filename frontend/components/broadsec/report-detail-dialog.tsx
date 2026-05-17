"use client";

import { CalendarDays, CheckCircle2, CircleDollarSign, Target, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SeverityBadge, StatusBadge, ValidityBadge } from "@/components/broadsec/badges";
import type { VulnerabilityReport } from "@/types";

interface ReportDetailDialogProps {
  report?: VulnerabilityReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mad = new Intl.NumberFormat("en-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

export function ReportDetailDialog({
  report,
  open,
  onOpenChange,
}: ReportDetailDialogProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl border-border bg-background p-0">
        <DialogHeader className="border-b border-border px-6 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl leading-tight">{report.title}</DialogTitle>
              <DialogDescription>
                {report.id} submitted to {report.program_name}
              </DialogDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={report.severity} />
              <StatusBadge status={report.status} />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-104px)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Affected Target
                </h3>
                <div className="flex items-start gap-3 rounded-lg border border-border bg-cardBg p-4">
                  <Target className="mt-0.5 h-4 w-4 text-accent" />
                  <div>
                    <p className="font-medium">{report.affected_target}</p>
                    <p className="text-sm text-muted-foreground">{report.domain}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Reproduction Steps
                </h3>
                <ol className="space-y-2">
                  {report.reproduction_steps.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 rounded-lg border border-border bg-cardBg p-3 text-sm"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                        {index + 1}
                      </span>
                      <span className="leading-6">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Impact
                </h3>
                <p className="rounded-lg border border-border bg-cardBg p-4 text-sm leading-6">
                  {report.impact}
                </p>
              </section>

              {report.ai_triage ? (
                <section className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                      AI Triage Result
                    </h3>
                    <ValidityBadge validity={report.ai_triage.validity} />
                  </div>
                  <div className="grid gap-3 rounded-lg border border-border bg-cardBg p-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Severity</p>
                      <p className="mt-1 font-semibold">{report.ai_triage.severity_label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CVSS</p>
                      <p className="mt-1 font-semibold">{report.ai_triage.cvss_score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="mt-1 font-semibold">{report.ai_triage.confidence}%</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-cardBg p-4">
                    <p className="text-sm font-medium">Recommended Fix</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {report.ai_triage.fix_suggestion}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-cardBg p-4">
                    <p className="text-sm font-medium">Researcher Response Draft</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {report.ai_triage.response_draft}
                    </p>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-cardBg p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-accent" />
                  Reporter
                </div>
                <Separator className="my-3" />
                <p className="font-semibold">{report.reporter_handle}</p>
                <p className="text-sm text-muted-foreground">
                  Reputation {report.reporter_reputation.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-cardBg p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  Timeline
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(report.submitted_at).toLocaleDateString()}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">Updated</p>
                <p className="font-medium">
                  {new Date(report.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-cardBg p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CircleDollarSign className="h-4 w-4 text-accent" />
                  Bounty
                </div>
                <Separator className="my-3" />
                <p className="text-2xl font-bold">
                  {mad.format(report.bounty_amount ?? 0)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Proposed reward based on current triage state.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-cardBg p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Scope
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground">
                  {report.ai_triage?.in_scope ?? true
                    ? "Target appears in scope for the selected demo program."
                    : "AI triage marked this report as out of scope."}
                </p>
              </div>
            </aside>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
