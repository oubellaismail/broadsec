import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/api";
import { FALLBACK_REPORT_RESULT } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const { raw_notes } = (await req.json()) as { raw_notes?: string };

  if (!raw_notes?.trim()) {
    return NextResponse.json(
      { detail: "Raw notes are required." },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await generateReport(raw_notes));
  } catch {
    return NextResponse.json(FALLBACK_REPORT_RESULT);
  }
}
