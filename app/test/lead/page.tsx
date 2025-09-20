"use client";
import { useState } from "react";

export default function TestLead() {
  const [name,setName]     = useState("Lorenzo");
  const [email,setEmail]   = useState("lorenzo@example.com");
  const [message,setMsg]   = useState("Hello from the test lead form");
  const [out,setOut]       = useState<any>(null);
  const [busy,setBusy]     = useState(false);

  async function send(){
    setBusy(true); setOut(null);
    const r = await fetch("/api/lead", {
      method:"POST",
      headers:{"content-type":"application/json"},
      body: JSON.stringify({ name, email, message, source:"/test/lead" })
    });
    const j = await r.json();
    setOut(j); setBusy(false);
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold">Test Lead Capture</h1>
      <div className="ui-card p-6 mt-4 grid gap-3 max-w-lg">
        <label className="text-sm">Name
          <input className="w-full rounded bg-white/10 p-2" value={name} onChange={e=>setName(e.target.value)}/>
        </label>
        <label className="text-sm">Email
          <input className="w-full rounded bg-white/10 p-2" value={email} onChange={e=>setEmail(e.target.value)}/>
        </label>
        <label className="text-sm">Message
          <textarea className="w-full rounded bg-white/10 p-2 h-24" value={message} onChange={e=>setMsg(e.target.value)}/>
        </label>
        <button onClick={send} disabled={busy} className="btn btn-primary">{busy?"Sending…":"Send"}</button>
        {out && <pre className="mt-2 text-xs whitespace-pre-wrap">{JSON.stringify(out,null,2)}</pre>}
      </div>
    </div>
  );
}
