import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReportStatus, Severity, SeverityLabel, TriageValidity } from "@/types";

const severityClasses: Record<Severity | SeverityLabel, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/20",
  Critical: "bg-red-500/20 text-red-400 border-red-500/20",
  high: "bg-orange-500/20 text-orange-300 border-orange-500/20",
  High: "bg-orange-500/20 text-orange-300 border-orange-500/20",
  medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
  Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/20",
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  Low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  informative: "bg-sky-500/20 text-sky-300 border-sky-500/20",
  Informative: "bg-sky-500/20 text-sky-300 border-sky-500/20",
};

const statusClasses: Record<ReportStatus, string> = {
  submitted: "bg-sky-500/20 text-sky-300 border-sky-500/20",
  pending_triage: "bg-amber-500/20 text-amber-300 border-amber-500/20",
  ai_triaged: "bg-violet-500/20 text-violet-300 border-violet-500/20",
  under_review: "bg-blue-500/20 text-blue-300 border-blue-500/20",
  valid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  duplicate: "bg-zinc-500/20 text-zinc-300 border-zinc-500/20",
  out_of_scope: "bg-rose-500/20 text-rose-300 border-rose-500/20",
  resolved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  paid: "bg-lime-500/20 text-lime-300 border-lime-500/20",
};

const validityClasses: Record<TriageValidity, string> = {
  valid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
  needs_more_info: "bg-amber-500/20 text-amber-300 border-amber-500/20",
  invalid: "bg-red-500/20 text-red-300 border-red-500/20",
};

export function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SeverityBadge({ severity }: { severity: Severity | SeverityLabel }) {
  return (
    <Badge variant="outline" className={cn("border", severityClasses[severity])}>
      {formatStatus(severity)}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <Badge variant="outline" className={cn("border", statusClasses[status])}>
      {formatStatus(status)}
    </Badge>
  );
}

export function ValidityBadge({ validity }: { validity: TriageValidity }) {
  return (
    <Badge variant="outline" className={cn("border", validityClasses[validity])}>
      {formatStatus(validity)}
    </Badge>
  );
}
