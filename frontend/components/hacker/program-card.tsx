import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LightBadge, ProgramIcon, formatMad } from "@/components/hacker/hacker-ui";
import type { HackerProgram } from "@/types";

export function ProgramCard({ program }: { program: HackerProgram }) {
  const criticalRange = program.rewardRanges.find((range) => range.severity === "Critical");
  const primaryScope = program.scopes[0]?.domain ?? "example.ma";

  return (
    <article className="rounded-2xl border border-white/8 bg-white/3 p-5 transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ProgramIcon tone={program.logoTone} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#D4A017]/70">
              Program
            </p>
            <h2 className="mt-0.5 text-base font-bold text-white">{program.name}</h2>
            <p className="text-sm text-white/45">{program.companyName}</p>
          </div>
        </div>
        <LightBadge value={program.status}>{program.status}</LightBadge>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/50">
        {program.description}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-white/35">Scope</p>
          <p className="mt-1 text-sm font-semibold text-white/80">{primaryScope}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-white/35">Critical reward</p>
          <p className="mt-1 text-sm font-semibold text-[#D4A017]">
            {criticalRange
              ? `${formatMad.format(criticalRange.minMad)} – ${formatMad.format(criticalRange.maxMad)}`
              : "Reward available"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <ShieldCheck className="h-4 w-4 text-[#D4A017]/60" />
          {program.riskLevel} risk
        </div>
        <Link
          href={`/hacker/programs/${program.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4A017]/15 px-3.5 py-2 text-sm font-semibold text-[#D4A017] transition hover:bg-[#D4A017]/25"
        >
          View
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
