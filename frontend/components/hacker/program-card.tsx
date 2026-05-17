import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LightBadge, ProgramIcon, formatMad } from "@/components/hacker/hacker-ui";
import type { HackerProgram } from "@/types";

export function ProgramCard({ program }: { program: HackerProgram }) {
  const criticalRange = program.rewardRanges.find((range) => range.severity === "Critical");
  const primaryScope = program.scopes[0]?.domain ?? "example.ma";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ProgramIcon tone={program.logoTone} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Program
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">{program.name}</h2>
            <p className="text-sm text-slate-500">{program.companyName}</p>
          </div>
        </div>
        <LightBadge value={program.status}>{program.status}</LightBadge>
      </div>
      <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">
        {program.description}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Scope</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{primaryScope}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Critical rewards</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {criticalRange
              ? `${formatMad.format(criticalRange.minMad)} - ${formatMad.format(criticalRange.maxMad)}`
              : "Reward available"}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          {program.riskLevel} risk
        </div>
        <Link
          href={`/hacker/programs/${program.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
