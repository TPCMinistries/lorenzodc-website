// app/api/diagnostic/email/route.ts
import { NextResponse } from "next/server";
import { sendViaN8N } from "../../../lib/email/n8n";

export const runtime = "nodejs";

function toBase64Maybe(input: any): string | undefined {
  if (!input) return undefined;

  if (typeof input === "string") {
    if (/^[A-Za-z0-9+/=]+$/.test(input) && input.length % 4 === 0) return input;
    return Buffer.from(input, "utf8").toString("base64");
  }
  try {
    const buf = Buffer.isBuffer(input)
      ? input
      : Buffer.from(input?.data ?? input);
    return buf.toString("base64");
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const to: string = body.to;
    const subject: string = body.subject;
    const html: string | undefined = body.html;
    const text: string | undefined = body.text;
    const filename: string = body.filename || "ai_readiness_scorecard.pdf";

    const pdfBase64 =
      body.pdfBase64 ||
      toBase64Maybe(body.pdfBytes) ||
      toBase64Maybe(body.pdf);

    if (!to || !subject || !filename || !pdfBase64) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (to, subject, filename, pdfBase64/pdfBytes)" },
        { status: 400 }
      );
    }

    await sendViaN8N({ to, subject, html, text, filename, pdfBase64 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "email_failed" },
      { status: 500 }
    );
  }
}
