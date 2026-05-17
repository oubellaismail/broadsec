"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Activity, Globe2, Loader2, LockKeyhole, Network, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SeverityBadge } from "@/components/broadsec/badges";
import { scanUrl } from "@/lib/api";
import { MOCK_PORT_FINDINGS, fallbackScanResult } from "@/lib/mock-data";
import type { ScanResult } from "@/types";

const gradeScore = {
  A: 100,
  B: 82,
  C: 64,
  D: 42,
  F: 18,
};

const gradeClass = {
  A: "text-emerald-300",
  B: "text-cyan-300",
  C: "text-yellow-300",
  D: "text-orange-300",
  F: "text-red-400",
};

export function ScannerView() {
  const [url, setUrl] = useState("https://recharge.atlas-telecom.example.ma");
  const [result, setResult] = useState<ScanResult>();
  const [isScanning, setIsScanning] = useState(false);
  const [notice, setNotice] = useState<string>();

  const groupedFindings = useMemo(() => {
    const vulnerabilities = result?.vulnerabilities ?? [];

    return {
      headers: vulnerabilities.filter(
        (item) =>
          item.id.startsWith("hdr") ||
          item.name.toLowerCase().includes("header") ||
          item.name.toLowerCase().includes("policy") ||
          item.name.toLowerCase().includes("clickjacking")
      ),
      ssl: vulnerabilities.filter(
        (item) =>
          item.id.startsWith("ssl") ||
          item.name.toLowerCase().includes("ssl") ||
          item.name.toLowerCase().includes("tls")
      ),
    };
  }, [result]);

  const runScan = async () => {
    setIsScanning(true);
    setNotice(undefined);

    try {
      setResult(await scanUrl(url));
    } catch (error) {
      setResult(fallbackScanResult(url));
      setNotice(
        error instanceof Error
          ? `API unavailable. Showing mock scanner fallback: ${error.message}`
          : "API unavailable. Showing mock scanner fallback."
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-cardBg">
        <CardHeader>
          <CardTitle>Scanner</CardTitle>
          <CardDescription>
            Calls POST /scan for HTTP header and SSL checks from the BroadSec API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Globe2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://demo-target.example.ma"
                className="bg-inputBg pl-9"
              />
            </div>
            <Button onClick={runScan} disabled={isScanning || !url.trim()}>
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search />}
              Start scan
            </Button>
          </div>

          {notice ? (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {notice}
            </div>
          ) : null}

          <div className="rounded-lg border border-border bg-background/40 p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-accent" />
              <p className="text-sm text-muted-foreground">
                Status: {isScanning ? "Scanning target..." : result ? "Scan complete" : "Ready"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {result ? (
        <>
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="bg-cardBg">
              <CardHeader>
                <CardTitle>Security Grade</CardTitle>
                <CardDescription>{result.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className={`text-6xl font-bold ${gradeClass[result.overall_score]}`}>
                    {result.overall_score}
                  </span>
                  <span className="pb-2 text-sm text-muted-foreground">
                    {result.total} findings
                  </span>
                </div>
                <Progress value={gradeScore[result.overall_score]} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Scanned {new Date(result.scanned_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-cardBg">
              <CardHeader>
                <CardTitle>Security Findings</CardTitle>
                <CardDescription>{result.url}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.vulnerabilities.map((finding) => (
                  <div
                    key={finding.id}
                    className="rounded-lg border border-border bg-background/50 p-4"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-medium">{finding.name}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {finding.description}
                        </p>
                      </div>
                      <SeverityBadge severity={finding.severity} />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Affected: {finding.affected} - CVSS {finding.cvss_score}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <FindingGroup
              icon={<Globe2 className="h-4 w-4 text-accent" />}
              title="Headers"
              description="HTTP response header checks from /scan."
              findings={groupedFindings.headers}
            />
            <FindingGroup
              icon={<LockKeyhole className="h-4 w-4 text-accent" />}
              title="SSL"
              description="Certificate and TLS findings returned by /scan."
              findings={groupedFindings.ssl}
            />
            <Card className="bg-cardBg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Network className="h-4 w-4 text-accent" />
                  Ports
                </CardTitle>
                <CardDescription>
                  Demo inventory. API.md does not document port scan fields.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_PORT_FINDINGS.map((finding) => (
                  <div
                    key={finding.port}
                    className="rounded-lg border border-border bg-background/50 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">
                        {finding.port}/{finding.service}
                      </p>
                      <Badge variant="outline" className="border-border text-muted-foreground">
                        {finding.state}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {finding.note}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}

function FindingGroup({
  icon,
  title,
  description,
  findings,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  findings: ScanResult["vulnerabilities"];
}) {
  return (
    <Card className="bg-cardBg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {findings.length ? (
          findings.map((finding) => (
            <div
              key={finding.id}
              className="rounded-lg border border-border bg-background/50 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{finding.name}</p>
                <SeverityBadge severity={finding.severity} />
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {finding.description}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-background/30 p-4 text-sm text-muted-foreground">
            No findings in this category.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
