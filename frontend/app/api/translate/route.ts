import { NextRequest, NextResponse } from "next/server";
import { translateContent } from "@/lib/api";
import { fallbackTranslateResult } from "@/lib/mock-data";
import type { TranslateTarget } from "@/types";

export async function POST(req: NextRequest) {
  const { text, target } = (await req.json()) as {
    text?: string;
    target?: TranslateTarget;
  };

  if (!text?.trim() || !target) {
    return NextResponse.json(
      { detail: "text and target required" },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await translateContent({ text, target }));
  } catch {
    return NextResponse.json(fallbackTranslateResult(text, target));
  }
}
