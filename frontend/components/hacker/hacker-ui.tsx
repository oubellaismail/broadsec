import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  blue: "bg-blue-100 text-blue-700",
  cyan: "bg-cyan-100 text-cyan-700",
  violet: "bg-violet-100 text-violet-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  slate: "bg-slate-200 text-slate-700",
};

const severityClasses = {
  Critical: "bg-red-50 text-red-700 ring-red-200",
  High: "bg-orange-50 text-orange-700 ring-orange-200",
  Medium: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const statusClasses = {
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Paused: "bg-amber-50 text-amber-700 ring-amber-200",
  Private: "bg-slate-100 text-slate-700 ring-slate-200",
  "Under Review": "bg-blue-50 text-blue-700 ring-blue-200",
  Accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Duplicate: "bg-slate-100 text-slate-700 ring-slate-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Fixed: "bg-violet-50 text-violet-700 ring-violet-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export const formatMad = new Intl.NumberFormat("en-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

export function ProgramIcon({ tone }: { tone: keyof typeof toneClasses }) {
  return (
    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", toneClasses[tone])}>
      <Building2 className="h-6 w-6" />
    </div>
  );
}

export function LightBadge({
  children,
  variant = "status",
  value,
}: {
  children: ReactNode;
  variant?: "status" | "severity";
  value: keyof typeof statusClasses | keyof typeof severityClasses;
}) {
  const className =
    variant === "severity"
      ? severityClasses[value as keyof typeof severityClasses]
      : statusClasses[value as keyof typeof statusClasses];

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", className)}>
      {children}
    </span>
  );
}
