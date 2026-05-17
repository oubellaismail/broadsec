import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  blue:    "bg-[#1B3A8C]/20 text-[#2E5FE8]",
  cyan:    "bg-[#1A7A6E]/20 text-[#1A7A6E]",
  violet:  "bg-purple-500/15 text-purple-400",
  emerald: "bg-[#1F6B35]/20 text-[#1F6B35]",
  amber:   "bg-[#D4A017]/15 text-[#D4A017]",
  slate:   "bg-white/8 text-white/50",
};

const severityClasses: Record<string, string> = {
  Critical: "bg-[#C0533A]/20 text-[#C0533A] ring-[#C0533A]/30",
  High:     "bg-[#D4A017]/15 text-[#D4A017] ring-[#D4A017]/30",
  Medium:   "bg-[#1A7A6E]/15 text-[#1A7A6E] ring-[#1A7A6E]/30",
  Low:      "bg-[#1F6B35]/15 text-[#4ade80] ring-[#1F6B35]/30",
};

const statusClasses: Record<string, string> = {
  Open:           "bg-[#1F6B35]/15 text-[#4ade80] ring-[#1F6B35]/30",
  Paused:         "bg-[#D4A017]/15 text-[#D4A017] ring-[#D4A017]/30",
  Private:        "bg-white/8 text-white/50 ring-white/10",
  "Under Review": "bg-[#1B3A8C]/20 text-[#2E5FE8] ring-[#2E5FE8]/30",
  Accepted:       "bg-[#1F6B35]/15 text-[#4ade80] ring-[#1F6B35]/30",
  Duplicate:      "bg-white/8 text-white/50 ring-white/10",
  Rejected:       "bg-[#C0533A]/20 text-[#C0533A] ring-[#C0533A]/30",
  Fixed:          "bg-purple-500/15 text-purple-400 ring-purple-500/30",
  Pending:        "bg-[#D4A017]/15 text-[#D4A017] ring-[#D4A017]/30",
  Paid:           "bg-[#1F6B35]/15 text-[#4ade80] ring-[#1F6B35]/30",
};

export const formatMad = new Intl.NumberFormat("en-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

export function ProgramIcon({ tone }: { tone: string }) {
  const cls = toneClasses[tone] ?? toneClasses.slate;
  return (
    <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", cls)}>
      <Building2 className="h-5 w-5" />
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
  value: string;
}) {
  const className =
    variant === "severity"
      ? (severityClasses[value] ?? "bg-white/8 text-white/50 ring-white/10")
      : (statusClasses[value] ?? "bg-white/8 text-white/50 ring-white/10");

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", className)}>
      {children}
    </span>
  );
}
