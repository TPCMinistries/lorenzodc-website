import { NextResponse } from "next/server";

export async function POST(req: Request){
  const body = await req.json();
  const provider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();
  const system = `You are a pragmatic FUTURIST consultant. Create a crisp 90-day AI pilot blueprint.
- Include: goals, 3 workstreams, weekly milestones, success metrics, risks/guardrails, and a simple ROI section.
- End with a short CTA to work with Lorenzo for implementation.`;

  try{
    if (provider === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{ "content-type":"application/json", authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
        body: JSON.stringify({ model:"gpt-4o-mini", temperature:0.35, messages:[
          { role:"system", content: system },
          { role:"user", content: `Context: ${JSON.stringify(body, null, 2)}` }
        ]})
      });
      const j = await r.json();
      const text = j.choices?.[0]?.message?.content ?? "";
      return NextResponse.json({ ok:true, provider, text });
    }

    // Gemini default
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,{
      method:"POST",
      headers:{ "content-type":"application/json"},
      body: JSON.stringify({
        contents: [{ parts:[{ text: `${system}\n\nUSER CONTEXT:\n${JSON.stringify(body, null, 2)}` }]}],
        generationConfig:{ temperature:0.35 }
      })
    });
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return NextResponse.json({ ok:true, provider, text });
  } catch(e:any){
    return NextResponse.json({ ok:false, error:e?.message || "LLM error" }, { status:500 });
  }
}
