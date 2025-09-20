// app/one-pager/page.tsx
"use client";
import { useState } from "react";

export default function OnePager() {
  const skool = process.env.NEXT_PUBLIC_SKOOL_JOIN_URL || "#";

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg]   = useState<string>("");

  async function submitLead() {
    setBusy(true); setMsg("");
    const r = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source: "one-pager", message: "Send my PDFs & updates" }),
    });
    const j = await r.json();
    setBusy(false);
    setMsg(j.ok ? "Got it — check your inbox!" : (j.error || "Something went wrong"));
  }

  return (
    <section className="container py-10">
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Welcome to The Catalyst Path</h1>
      <p className="text-white/70 mt-2">Three fast ways to try, learn, or talk with us—right now.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <a href="/chat" className="ui-card p-8 text-center">
          <h3 className="text-xl font-semibold">Try Chat</h3>
          <p className="text-white/70 mt-2">Ask anything. Get a helpful next step.</p>
        </a>
        <a href="/quiz" className="ui-card p-8 text-center">
          <h3 className="text-xl font-semibold">Take the Quiz</h3>
          <p className="text-white/70 mt-2">Get your readiness score in 2 minutes.</p>
        </a>
        <a href="/enterprise" className="ui-card p-8 text-center">
          <h3 className="text-xl font-semibold">Executive Toolkit</h3>
          <p className="text-white/70 mt-2">Diagnostic, ROI, RAG, pilot plan.</p>
        </a>
      </div>

      <div className="ui-card p-8 mt-8">
        <p className="text-white/80">Want the PDFs + briefings in your inbox?</p>
        <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full sm:max-w-sm rounded bg-white/10 p-3"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <button
            onClick={submitLead}
            disabled={busy || !email}
            className="btn btn-primary"
          >
            {busy ? "Sending…" : "Email me the PDFs"}
          </button>
          {msg && <span className="text-sm text-white/70">{msg}</span>}
        </div>
      </div>

      <div className="ui-card p-8 mt-8 text-center">
        <p className="text-white/70">Want ongoing support?</p>
        <a href={skool} target="_blank" className="btn btn-primary mt-3">
          Join the Community ($79/mo)
        </a>
      </div>
    </section>
  );
}
