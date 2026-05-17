import { NextRequest, NextResponse } from "next/server";
import { triageReport } from "@/lib/api";
import { MOCK_TRIAGE_RESULT } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const { report, scope = [] } = (await req.json()) as {
    report?: string;
    scope?: string[];
  };

  if (!report?.trim()) {
    return NextResponse.json(
      { detail: "Report text is required." },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await triageReport({ report, scope }));
  } catch {
    return NextResponse.json(MOCK_TRIAGE_RESULT);
  }
}
