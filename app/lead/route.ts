// app/api/lead/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { name, email, source, message } = await req.json();

  if (!email) {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }

  const payload = {
    source: source || "site",
    name: (name || "").trim(),
    email: String(email).trim().toLowerCase(),
    message: message || "",
    ts: new Date().toISOString(),
  };

  // Optional: forward to your CRM webhook if set
  const url = process.env.CRM_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // swallow CRM errors; still return ok to the user
    }
  }

  return NextResponse.json({ ok: true });
}
