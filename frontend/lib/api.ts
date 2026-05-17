import type {
  HealthResponse,
  ReportResult,
  ScanResult,
  TranslateResult,
  TranslateTarget,
  TriageResult,
} from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://broadsec-api-462203665247.europe-west9.run.app";

type JsonBody = Record<string, unknown>;

interface ApiErrorBody {
  detail?: string;
  error?: string;
}

async function parseError(res: Response): Promise<string> {
  const fallback = `API request failed with status ${res.status}`;

  try {
    const body = (await res.json()) as ApiErrorBody;
    return body.detail ?? body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function api<T>(path: string, body?: JsonBody): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json() as Promise<T>;
}

export function getHealth(): Promise<HealthResponse> {
  return api<HealthResponse>("/health");
}

export function scanUrl(url: string): Promise<ScanResult> {
  return api<ScanResult>("/scan", { url });
}

export function triageReport(input: {
  report: string;
  scope?: string[];
}): Promise<TriageResult> {
  return api<TriageResult>("/triage", input);
}

export function generateReport(raw_notes: string): Promise<ReportResult> {
  return api<ReportResult>("/report", { raw_notes });
}

export function translateContent(input: {
  text: string;
  target: TranslateTarget;
}): Promise<TranslateResult> {
  return api<TranslateResult>("/translate", input);
}
