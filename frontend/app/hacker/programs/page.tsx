import { ProgramCard } from "@/components/hacker/program-card";
import { HACKER_PROGRAMS } from "@/lib/mock-data";

export default function HackerProgramsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Programs</h1>
          <p className="mt-1.5 text-sm text-white/45">
            Explore Moroccan demo bug bounty programs with safe fictional scopes.
          </p>
        </div>
        <div className="rounded-full border border-[#D4A017]/25 bg-[#D4A017]/10 px-4 py-1.5 text-sm font-semibold text-[#D4A017]">
          {HACKER_PROGRAMS.length} active programs
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {HACKER_PROGRAMS.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
}
