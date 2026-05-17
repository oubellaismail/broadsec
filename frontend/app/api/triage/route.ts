// ── /api/triage ────────────────────────────────────────────────────────────
// POST { report: string, scope: string[] } → AiTriage

import { NextRequest, NextResponse } from "next/server";
import { triageReport } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { report, scope = [] } = await req.json();
    if (!report) return NextResponse.json({ error: "Report text required" }, { status: 400 });

    const result = await triageReport(report, scope);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/triage]", err);
    return NextResponse.json({ error: "Triage failed" }, { status: 500 });
  }
}
