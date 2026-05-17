"use client";

import { useMemo, useState } from "react";
import { Bot, FileText, Languages, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SeverityBadge, ValidityBadge } from "@/components/broadsec/badges";
import { generateReport, translateContent, triageReport } from "@/lib/api";
import {
  BROADSEC_PROGRAMS,
  FALLBACK_REPORT_RESULT,
  MOCK_TRIAGE_RESULT,
  fallbackTranslateResult,
} from "@/lib/mock-data";
import type { ReportResult, TranslateResult, TranslateTarget, TriageResult } from "@/types";

const defaultReport =
  "Researcher report for demo scope: I found an authorization issue on banking.banque-atlas.example.ma/statements. After logging in with a demo account, changing the statement id returns metadata for another demo account. The response includes document id, period, and masked holder reference.";

const defaultNotes =
  "idor on statement endpoint, demo user can change statement id and see other statement metadata, auth required, impacts customer privacy";

export function AiTriageView() {
  const [programId, setProgramId] = useState(BROADSEC_PROGRAMS[1]?.id ?? "");
  const [reportText, setReportText] = useState(defaultReport);
  const [triageResult, setTriageResult] = useState<TriageResult>();
  const [triageNotice, setTriageNotice] = useState<string>();
  const [isTriaging, setIsTriaging] = useState(false);

  const [notes, setNotes] = useState(defaultNotes);
  const [reportResult, setReportResult] = useState<ReportResult>();
  const [reportNotice, setReportNotice] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);

  const [translationText, setTranslationText] = useState(
    "A high severity authorization flaw was confirmed in the demo banking portal."
  );
  const [target, setTarget] = useState<TranslateTarget>("english");
  const [translation, setTranslation] = useState<TranslateResult>();
  const [translationNotice, setTranslationNotice] = useState<string>();
  const [isTranslating, setIsTranslating] = useState(false);

  const selectedProgram = useMemo(
    () => BROADSEC_PROGRAMS.find((program) => program.id === programId),
    [programId]
  );

  const runTriage = async () => {
    setIsTriaging(true);
    setTriageNotice(undefined);

    try {
      setTriageResult(
        await triageReport({
          report: reportText,
          scope: selectedProgram?.scope ?? [],
        })
      );
    } catch (error) {
      setTriageResult(MOCK_TRIAGE_RESULT);
      setTriageNotice(
        error instanceof Error
          ? `API unavailable. Showing mock triage fallback: ${error.message}`
          : "API unavailable. Showing mock triage fallback."
      );
    } finally {
      setIsTriaging(false);
    }
  };

  const runReportWriter = async () => {
    setIsGenerating(true);
    setReportNotice(undefined);

    try {
      setReportResult(await generateReport(notes));
    } catch (error) {
      setReportResult(FALLBACK_REPORT_RESULT);
      setReportNotice(
        error instanceof Error
          ? `API unavailable. Showing mock report fallback: ${error.message}`
          : "API unavailable. Showing mock report fallback."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const runTranslate = async () => {
    setIsTranslating(true);
    setTranslationNotice(undefined);

    try {
      setTranslation(await translateContent({ text: translationText, target }));
    } catch (error) {
      setTranslation(fallbackTranslateResult(translationText, target));
      setTranslationNotice(
        error instanceof Error
          ? `API unavailable. Showing mock translation fallback: ${error.message}`
          : "API unavailable. Showing mock translation fallback."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Tabs defaultValue="triage" className="space-y-4">
      <TabsList className="grid h-auto w-full grid-cols-3 bg-cardBg md:w-fit">
        <TabsTrigger value="triage" className="gap-2">
          <Bot className="h-4 w-4" />
          Triage
        </TabsTrigger>
        <TabsTrigger value="writer" className="gap-2">
          <FileText className="h-4 w-4" />
          Report
        </TabsTrigger>
        <TabsTrigger value="translate" className="gap-2">
          <Languages className="h-4 w-4" />
          Translate
        </TabsTrigger>
      </TabsList>

      <TabsContent value="triage" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="bg-cardBg">
          <CardHeader>
            <CardTitle>AI Triage</CardTitle>
            <CardDescription>
              Calls POST /triage with report text and selected program scope.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Program Scope</Label>
              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger className="bg-inputBg">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {BROADSEC_PROGRAMS.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Text</Label>
              <Textarea
                value={reportText}
                onChange={(event) => setReportText(event.target.value)}
                className="min-h-[220px] bg-inputBg"
              />
            </div>
            {triageNotice ? (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {triageNotice}
              </div>
            ) : null}
            <Button onClick={runTriage} disabled={isTriaging || !reportText.trim()}>
              {isTriaging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles />}
              Run AI triage
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-cardBg">
          <CardHeader>
            <CardTitle>Triage Result</CardTitle>
            <CardDescription>
              Full response returned by the /triage endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {triageResult ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <SeverityBadge severity={triageResult.severity_label} />
                  <ValidityBadge validity={triageResult.validity} />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Metric label="CVSS" value={String(triageResult.cvss_score)} />
                  <Metric label="Confidence" value={`${triageResult.confidence}%`} />
                  <Metric label="In Scope" value={triageResult.in_scope ? "Yes" : "No"} />
                  <Metric label="Duplicate" value={triageResult.is_duplicate ? "Yes" : "No"} />
                  <Metric label="Type" value={triageResult.vulnerability_type} />
                  <Metric
                    label="Processed"
                    value={new Date(triageResult.processed_at).toLocaleString()}
                  />
                </div>
                <ResultBlock label="CVSS Vector" value={triageResult.cvss_vector} />
                <ResultBlock label="Fix Suggestion" value={triageResult.fix_suggestion} />
                <ResultBlock label="Simple Explanation" value={triageResult.simple_explanation} />
                <ResultBlock
                  label="Technical Explanation"
                  value={triageResult.technical_explanation}
                />
                <ResultBlock label="Response Draft" value={triageResult.response_draft} />
              </>
            ) : (
              <EmptyState message="Run triage to see validity, confidence, CVSS, scope, duplicate status, explanations, fix guidance, and response draft." />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="writer" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="bg-cardBg">
          <CardHeader>
            <CardTitle>Report Writer</CardTitle>
            <CardDescription>
              Calls POST /report to convert rough notes into a professional report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-[220px] bg-inputBg"
            />
            {reportNotice ? (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {reportNotice}
              </div>
            ) : null}
            <Button onClick={runReportWriter} disabled={isGenerating || !notes.trim()}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText />}
              Polish notes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-cardBg">
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
            <CardDescription>Structured fields returned by the API.</CardDescription>
          </CardHeader>
          <CardContent>
            {reportResult ? (
              <div className="space-y-4 text-sm leading-6">
                <ResultBlock label="Title" value={reportResult.title} />
                <ResultBlock label="Description" value={reportResult.description} />
                <ResultBlock label="Steps" value={reportResult.steps_to_reproduce} preserve />
                <ResultBlock label="Impact" value={reportResult.impact} />
                <ResultBlock label="Mitigation" value={reportResult.mitigation} />
                <ResultBlock
                  label="Suggested Severity"
                  value={reportResult.suggested_severity}
                />
              </div>
            ) : (
              <EmptyState message="Generate a report to preview title, steps, impact, mitigation, and severity." />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="translate" className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="bg-cardBg">
          <CardHeader>
            <CardTitle>Security Translation</CardTitle>
            <CardDescription>
              Calls POST /translate for supported language targets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={target} onValueChange={(value) => setTarget(value as TranslateTarget)}>
              <SelectTrigger className="bg-inputBg">
                <SelectValue placeholder="Target language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="darija">Moroccan Arabic</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={translationText}
              onChange={(event) => setTranslationText(event.target.value)}
              className="min-h-[180px] bg-inputBg"
            />
            {translationNotice ? (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {translationNotice}
              </div>
            ) : null}
            <Button
              onClick={runTranslate}
              disabled={isTranslating || !translationText.trim()}
            >
              {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages />}
              Translate content
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-cardBg">
          <CardHeader>
            <CardTitle>Translated Output</CardTitle>
            <CardDescription>Technical terms are preserved by the backend contract.</CardDescription>
          </CardHeader>
          <CardContent>
            {translation ? (
              <div
                dir={translation.target === "arabic" || translation.target === "darija" ? "rtl" : "ltr"}
                className="rounded-lg border border-border bg-background/70 p-4 text-sm leading-7"
              >
                {translation.translated}
              </div>
            ) : (
              <EmptyState message="Translate a triage note for stakeholder-ready communication." />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function ResultBlock({
  label,
  value,
  preserve,
}: {
  label: string;
  value: string;
  preserve?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/60 p-4">
      <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className={preserve ? "whitespace-pre-line" : undefined}>{value}</p>
    </div>
  );
}
