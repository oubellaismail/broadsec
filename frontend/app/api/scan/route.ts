import { NextRequest, NextResponse } from "next/server";
import { scanUrl } from "@/lib/api";
import { fallbackScanResult } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url?: string };

  if (!url?.trim()) {
    return NextResponse.json({ detail: "URL required" }, { status: 400 });
  }

  try {
    return NextResponse.json(await scanUrl(url));
  } catch {
    return NextResponse.json(fallbackScanResult(url));
  }
}
