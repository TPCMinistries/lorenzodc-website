import { NextResponse } from "next/server";
export async function POST(req: Request){
  const { question } = await req.json();
  return NextResponse.json({ ok:true, answer:`(demo) I read your document and here's a concise answer to: "${question}"`, citations:[] });
}
