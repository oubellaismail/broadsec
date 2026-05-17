// ── /api/translate ─────────────────────────────────────────────────────────
// POST { text: string, target: "french"|"arabic"|"darija"|"english" } → { translated: string }

import { NextRequest, NextResponse } from "next/server";
import { translateSecurityContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();
    if (!text || !target) return NextResponse.json({ error: "text and target required" }, { status: 400 });

    const translated = await translateSecurityContent(text, target);
    return NextResponse.json({ translated });
  } catch (err) {
    console.error("[/api/translate]", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
