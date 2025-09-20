"use client";
import { useState } from "react";

export default function Blueprint() {
  const [form, set] = useState({ industry: "", goal: "", team: "", budget: "", notes: "" });
  const [out, setOut] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function gen() {
    setBusy(true);
    const r = await fetch("/api/blueprint", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    setOut(j.text || "");
    setBusy(false);            // ✅ call the setter, don’t assign
  }

  return (
    <section className="container py-10">
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Personalized AI Blueprint</h1>
      <p className="text-white/70 mt-2">
        A concise 90-day pilot plan tailored to your context. Bring this to your team or book us to implement.
      </p>

      <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6 mt-6 grid md:grid-cols-2 gap-4">
        {[
          ["Industry / organization", "industry"],
          ["Top outcome in 90 days", "goal"],
          ["Team size / roles", "team"],
          ["Budget range (rough)", "budget"],
        ].map(([label, key]) => (
          <label key={key} className="text-sm">
            <span className="text-white/85">{label}</span>
            <input
              className="w-full mt-1 rounded bg-white/10 p-2"
              value={(form as any)[key as string]}
              onChange={(e) => set((s) => ({ ...s, [key as string]: e.target.value }))}
            />
          </label>
        ))}

        <label className="md:col-span-2 text-sm">
          <span className="text-white/85">Anything else we should consider?</span>
          <textarea
            className="w-full mt-1 rounded bg-white/10 p-2 h-28"
            value={form.notes}
            onChange={(e) => set((s) => ({ ...s, notes: e.target.value }))}
          />
        </label>

        <button
          onClick={gen}
          disabled={busy}
          className="md:col-span-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-[#0b0e13]"
          style={{ background: "linear-gradient(135deg,#6ee7ff,#9b8cff)" }}
        >
          {busy ? "Generating…" : "Generate Blueprint"}
        </button>

        {out && (
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0f141a] p-4">
            <div className="prose prose-invert whitespace-pre-wrap">{out}</div>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(out)}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm border border-white/20 text-white hover:bg-white/10"
              >
                Copy
              </button>
              <a
                href="/enterprise"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm border border-white/20 text-white hover:bg-white/10"
              >
                Executive Toolkit
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-[#0b0e13]"
                style={{ background: "linear-gradient(135deg,#6ee7ff,#9b8cff)" }}
              >
                Book Briefing ($1,500)
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
