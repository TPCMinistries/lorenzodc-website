"use client";
import { useMemo, useState } from "react";

type Q = { key: string; label: string };
const QUESTIONS: Q[] = [
  { key: "strategy", label: "We have 1–3 defined AI use cases." },
  { key: "data", label: "Docs are organized and accessible with basic governance." },
  { key: "process", label: "We have written SOPs for repetitive tasks." },
  { key: "people", label: "We have an exec sponsor and 1–2 champions." },
  { key: "security", label: "We have a basic privacy/PII policy for AI tools." },
  { key: "tooling", label: "We use 1–2 approved AI tools (chat, transcription, etc.)." },
  { key: "workflow", label: "We run at least one simple automation." },
  { key: "measurement", label: "We track hours saved or error rates for a process." },
  { key: "change", label: "We can pilot with a small team within 30 days." },
  { key: "budget", label: "We can commit $5–25K to a 90-day pilot." },
];

export default function Quiz() {
  const [answers,setAns]=useState<Record<string, number>>({});
  const [busy,setBusy]=useState(false);
  const [out,setOut]=useState<any>(null);

  const progress = useMemo(()=>{
    const filled = Object.keys(answers).length;
    return Math.round((filled/QUESTIONS.length)*100);
  },[answers]);

  async function submit(){
    setBusy(true);
    const r = await fetch("/api/diagnostic",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({answers})});
    setOut(await r.json()); setBusy(false);
  }

  return (
    <section className="container py-10">
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">AI Readiness Quiz</h1>
      <p className="text-white/70 mt-2">Rate each statement from 1 (not true) to 5 (very true).</p>

      <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] mt-6 space-y-5">
        <div className="w-full bg-white/10 rounded h-2 overflow-hidden">
          <div className="bg-white/60 h-2" style={{width:`${progress}%`}} />
        </div>

        {QUESTIONS.map(q=>(
          <div key={q.key}>
            <p className="text-white/90 mb-2">{q.label}</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(v=>(
                <button key={v}
                  onClick={()=>setAns(s=>({...s,[q.key]:v}))}
                  className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm ${answers[q.key]===v?'text-[#0b0e13]':'text-white'} ${answers[q.key]===v?'':'border border-white/20 hover:bg-white/10'}`}
                  style={answers[q.key]===v ? {background:"linear-gradient(135deg,#6ee7ff,#9b8cff)"} : {}}
                >{v}</button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={submit} disabled={busy || progress<100} className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-[#0b0e13]" style={{background: "linear-gradient(135deg,#6ee7ff,#9b8cff)"}}>
          {busy? "Scoring…" : "Get Score + Roadmap"}
        </button>

        {out && (
          <div className="rounded-2xl border border-white/10 bg-[#0f141a] p-4">
            <p><b>Score:</b> {out.score} / 50</p>
            <p className="mt-1"><b>Tier:</b> {out.tier}</p>
            <p className="mt-2"><b>Roadmap:</b></p>
            <ul className="list-disc pl-6">
              {out.roadmap?.map((r:string)=> <li key={r}>{r}</li>)}
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="/enterprise/roi" className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm border border-white/20 text-white hover:bg-white/10">Estimate ROI</a>
              <a href="/enterprise" className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-[#0b0e13]" style={{background: "linear-gradient(135deg,#6ee7ff,#9b8cff)"}}>Executive Toolkit</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
