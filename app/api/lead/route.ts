import { NextResponse } from "next/server";

export const runtime = "nodejs"; export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { name, email, source, message } = await req.json();
  if (!email) return NextResponse.json({ ok:false, error:"Email required" }, { status:400 });

  try {
    // Insert into Supabase via REST (no SDK to keep deps lean)
    const url = `${process.env.SUPABASE_URL}/rest/v1/leads`;
    const r1 = await fetch(url, {
      method:"POST",
      headers:{
        "content-type":"application/json",
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        "authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
        "prefer":"return=minimal"
      },
      body: JSON.stringify([{ name, email, source: source || "site", message }])
    });
    if (!r1.ok) throw new Error(`Supabase insert failed: ${r1.status}`);

    // Optional webhook → n8n (or Pipedream/Make/Notion)
    if (process.env.CRM_WEBHOOK_URL) {
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method:"POST",
        headers:{ "content-type":"application/json" },
        body: JSON.stringify({ name, email, source: source || "site", message, ts: new Date().toISOString() })
      }).catch(()=>{ /* ignore webhook errors */ });
    }

    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || "Lead capture error" }, { status:500 });
  }
}
