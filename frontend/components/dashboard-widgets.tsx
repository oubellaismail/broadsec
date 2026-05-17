"use client";

import { Activity, BarChart3, Clock3, ShieldCheck } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SeverityBadge, StatusBadge } from "@/components/broadsec/badges";
import { StatsCard } from "@/components/widgets/stats-card";
import {
  BROADSEC_EVENTS,
  BROADSEC_PROGRAMS,
  BROADSEC_REPORTS,
  DASHBOARD_TRENDS,
  SEVERITY_DISTRIBUTION,
  STATUS_DISTRIBUTION,
} from "@/lib/mock-data";

const mad = new Intl.NumberFormat("en-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

const statusColors = ["#426CFF", "#A855F7", "#22C55E", "#71717A", "#84CC16"];

export function DashboardWidgets() {
  const totalReports = BROADSEC_PROGRAMS.reduce(
    (total, program) => total + program.reports_count,
    0
  );
  const pendingTriage = BROADSEC_PROGRAMS.reduce(
    (total, program) => total + program.pending_reports,
    0
  );
  const resolvedReports = BROADSEC_PROGRAMS.reduce(
    (total, program) => total + program.resolved_reports,
    0
  );
  const criticalHigh = BROADSEC_REPORTS.filter((report) =>
    ["critical", "high"].includes(report.severity)
  ).length;
  const bountyTotal = DASHBOARD_TRENDS.at(-1)?.bounty ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Reports"
        value={totalReports.toLocaleString()}
        change="+18.4%"
        trend="up"
        description="across active programs"
        icon="reports"
      />
      <StatsCard
        title="Pending Triage"
        value={pendingTriage.toLocaleString()}
        change="-6.2%"
        trend="down"
        description="awaiting analyst review"
        icon="triage"
      />
      <StatsCard
        title="Critical / High"
        value={criticalHigh.toLocaleString()}
        change="+2"
        trend="up"
        description="recent confirmed reports"
        icon="critical"
      />
      <StatsCard
        title="Resolved Reports"
        value={resolvedReports.toLocaleString()}
        change="+11.7%"
        trend="up"
        description="validated fixes"
        icon="resolved"
      />
      <StatsCard
        title="Bounty Total"
        value={mad.format(bountyTotal)}
        change="+9.8%"
        trend="up"
        description="approved in MAD"
        icon="bounty"
      />

      <Card className="bg-cardBg transition-colors hover:bg-cardHoverBg md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-accent" />
            Report Intake
          </CardTitle>
          <CardDescription>Monthly reports, resolutions, and MAD payouts.</CardDescription>
        </CardHeader>
        <CardContent className="h-[310px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DASHBOARD_TRENDS} margin={{ left: -24, right: 8 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#A1A1AA", fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#A1A1AA", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#1D1D1D",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="reports"
                stroke="#426CFF"
                fill="#426CFF"
                fillOpacity={0.22}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#22C55E"
                fill="#22C55E"
                fillOpacity={0.16}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-cardBg transition-colors hover:bg-cardHoverBg md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-accent" />
            Severity Mix
          </CardTitle>
          <CardDescription>Current triage distribution by severity.</CardDescription>
        </CardHeader>
        <CardContent className="h-[310px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SEVERITY_DISTRIBUTION} margin={{ left: -24, right: 8 }}>
              <XAxis
                dataKey="severity"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#A1A1AA", fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#A1A1AA", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "#1D1D1D",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="reports" radius={[6, 6, 0, 0]} fill="#426CFF" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-cardBg transition-colors hover:bg-cardHoverBg md:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock3 className="h-5 w-5 text-accent" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest admin and AI triage events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {BROADSEC_EVENTS.map((event) => (
            <div key={event.id} className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent/15">
                <Activity className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-5">{event.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {event.actor} - {new Date(event.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-cardBg transition-colors hover:bg-cardHoverBg md:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Status Distribution</CardTitle>
          <CardDescription>Queue state across current demo data.</CardDescription>
        </CardHeader>
        <CardContent className="h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={STATUS_DISTRIBUTION}
                dataKey="value"
                nameKey="status"
                innerRadius={56}
                outerRadius={92}
                paddingAngle={3}
              >
                {STATUS_DISTRIBUTION.map((entry, index) => (
                  <Cell key={entry.status} fill={statusColors[index % statusColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1D1D1D",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-cardBg transition-colors hover:bg-cardHoverBg md:col-span-2">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="text-lg">Recent Vulnerability Reports</CardTitle>
              <CardDescription>High-signal reports ready for demo triage workflows.</CardDescription>
            </div>
            <div className="text-sm font-semibold text-lime-300">
              {mad.format(bountyTotal)} total bounty
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead className="hidden md:table-cell">Program</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BROADSEC_REPORTS.slice(0, 5).map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.id} - {report.domain}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {report.program_name}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={report.severity} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
