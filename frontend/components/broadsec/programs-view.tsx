"use client";

import { Building2, CircleDollarSign, Globe2, PauseCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BROADSEC_PROGRAMS } from "@/lib/mock-data";

const mad = new Intl.NumberFormat("en-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

export function ProgramsView() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {BROADSEC_PROGRAMS.map((program) => {
        const resolvedRatio = Math.round(
          (program.resolved_reports / Math.max(program.reports_count, 1)) * 100
        );

        return (
          <Card key={program.id} className="bg-cardBg transition-colors hover:bg-cardHoverBg">
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription>{program.company}</CardDescription>
                    </div>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    {program.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit border-emerald-500/20 bg-emerald-500/20 text-emerald-300"
                >
                  {program.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    Reports
                  </p>
                  <p className="mt-2 text-xl font-semibold">{program.reports_count}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PauseCircle className="h-4 w-4" />
                    Pending
                  </p>
                  <p className="mt-2 text-xl font-semibold">{program.pending_reports}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/40 p-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CircleDollarSign className="h-4 w-4" />
                    Bounty Range
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {mad.format(program.reward_min)} - {mad.format(program.reward_max)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Resolved report ratio</span>
                  <span>{resolvedRatio}%</span>
                </div>
                <Progress value={resolvedRatio} className="h-2" />
              </div>

              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Globe2 className="h-4 w-4 text-accent" />
                  Scope Domains
                </p>
                <div className="flex flex-wrap gap-2">
                  {program.scope.map((scope) => (
                    <Badge
                      key={scope}
                      variant="outline"
                      className="border-border bg-background/50 text-muted-foreground"
                    >
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Out of Scope</p>
                <div className="flex flex-wrap gap-2">
                  {program.out_of_scope.map((scope) => (
                    <Badge
                      key={scope}
                      variant="outline"
                      className="border-border bg-background/50 text-muted-foreground"
                    >
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
