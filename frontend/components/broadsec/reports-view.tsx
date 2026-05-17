"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, FileCheck2, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportDetailDialog } from "@/components/broadsec/report-detail-dialog";
import { SeverityBadge, StatusBadge } from "@/components/broadsec/badges";
import { BROADSEC_PROGRAMS, BROADSEC_REPORTS, MOCK_TRIAGE_RESULT } from "@/lib/mock-data";
import { triageReport } from "@/lib/api";
import type { ReportStatus, Severity, VulnerabilityReport } from "@/types";

interface ReportsViewProps {
  globalSearch?: string;
}

const mad = new Intl.NumberFormat("en-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

const dateFilterOptions = {
  all: 0,
  "7d": 7,
  "30d": 30,
  older: 31,
};

export function ReportsView({ globalSearch = "" }: ReportsViewProps) {
  const [reports, setReports] = useState<VulnerabilityReport[]>(BROADSEC_REPORTS);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<ReportStatus | "all">("all");
  const [programId, setProgramId] = useState("all");
  const [dateWindow, setDateWindow] = useState<keyof typeof dateFilterOptions>("all");
  const [selectedReport, setSelectedReport] = useState<VulnerabilityReport>();
  const [triagingId, setTriagingId] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const combinedSearch = (search || globalSearch).trim().toLowerCase();

  const filteredReports = useMemo(() => {
    const now = new Date("2026-05-17T00:00:00-04:00").getTime();

    return reports.filter((report) => {
      const searchable = [
        report.title,
        report.domain,
        report.reporter_handle,
        report.program_name,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !combinedSearch || searchable.includes(combinedSearch);
      const matchesSeverity = severity === "all" || report.severity === severity;
      const matchesStatus = status === "all" || report.status === status;
      const matchesProgram = programId === "all" || report.program_id === programId;

      const daysOld = Math.floor(
        (now - new Date(report.submitted_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      const matchesDate =
        dateWindow === "all" ||
        (dateWindow === "older"
          ? daysOld >= dateFilterOptions.older
          : daysOld <= dateFilterOptions[dateWindow]);

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus &&
        matchesProgram &&
        matchesDate
      );
    });
  }, [combinedSearch, dateWindow, programId, reports, severity, status]);

  const updateReportStatus = (reportId: string, nextStatus: ReportStatus) => {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: nextStatus,
              updated_at: new Date().toISOString(),
            }
          : report
      )
    );
  };

  const handleTriage = async (report: VulnerabilityReport) => {
    setTriagingId(report.id);
    setNotice(undefined);

    const program = BROADSEC_PROGRAMS.find((item) => item.id === report.program_id);

    try {
      const result = await triageReport({
        report: `${report.title}\n\n${report.description}\n\nImpact: ${report.impact}`,
        scope: program?.scope ?? [],
      });

      setReports((current) =>
        current.map((item) =>
          item.id === report.id
            ? {
                ...item,
                status: "ai_triaged",
                ai_triage: result,
                cvss_score: result.cvss_score,
                severity: result.severity_label.toLowerCase() as Severity,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (error) {
      setReports((current) =>
        current.map((item) =>
          item.id === report.id
            ? {
                ...item,
                status: "ai_triaged",
                ai_triage: MOCK_TRIAGE_RESULT,
                cvss_score: MOCK_TRIAGE_RESULT.cvss_score,
                severity: MOCK_TRIAGE_RESULT.severity_label.toLowerCase() as Severity,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
      setNotice(
        error instanceof Error
          ? `API unavailable. Showing mock triage fallback: ${error.message}`
          : "API unavailable. Showing mock triage fallback."
      );
    } finally {
      setTriagingId(undefined);
    }
  };

  return (
    <div className="space-y-4">
      {notice ? (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {notice}
        </div>
      ) : null}

      <Card className="bg-cardBg">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle>Reports / Vulnerabilities</CardTitle>
              <CardDescription>
                Triage queue for submitted vulnerability reports across demo programs.
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 lg:grid-cols-[1.5fr_repeat(4,minmax(130px,1fr))]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, domain, reporter..."
                className="bg-inputBg pl-9"
              />
            </div>
            <Select value={severity} onValueChange={(value) => setSeverity(value as Severity | "all")}>
              <SelectTrigger className="bg-inputBg">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(value) => setStatus(value as ReportStatus | "all")}>
              <SelectTrigger className="bg-inputBg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending_triage">Pending triage</SelectItem>
                <SelectItem value="ai_triaged">AI triaged</SelectItem>
                <SelectItem value="under_review">Under review</SelectItem>
                <SelectItem value="duplicate">Duplicate</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger className="bg-inputBg">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All programs</SelectItem>
                {BROADSEC_PROGRAMS.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={dateWindow}
              onValueChange={(value) =>
                setDateWindow(value as keyof typeof dateFilterOptions)
              }
            >
              <SelectTrigger className="bg-inputBg">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any date</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="older">Older</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead className="hidden lg:table-cell">Program</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Bounty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{report.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.id} - {report.domain} - {report.reporter_handle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {report.program_name}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={report.severity} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {mad.format(report.bounty_amount ?? 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View details"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Run AI triage"
                          disabled={triagingId === report.id}
                          onClick={() => handleTriage(report)}
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Mark duplicate"
                          onClick={() => updateReportStatus(report.id, "duplicate")}
                        >
                          <FileCheck2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Resolve report"
                          onClick={() => updateReportStatus(report.id, "resolved")}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReportDetailDialog
        report={selectedReport}
        open={Boolean(selectedReport)}
        onOpenChange={(open) => {
          if (!open) setSelectedReport(undefined);
        }}
      />
    </div>
  );
}
