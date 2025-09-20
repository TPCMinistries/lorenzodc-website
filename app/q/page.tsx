"use client";
import { useEffect, useRef, useState } from "react";
import CtaBar from "../_components/CtaBar";
import { DatabaseUsageTracker } from "../lib/subscription/database-usage";
import { useAuth } from "../lib/hooks/useAuth";

// Speech recognition types now defined in app/types/speech.d.ts

const STARTERS = [
  "Give me 3 ways AI could save me 2 hours this week.",
  "Draft a 3-bullet exec brief from these notes: …",
  "Outline a 90-day AI pilot for HR onboarding.",
];

export default function QuickChat() {
  const [msg,setMsg]=useState(STARTERS[0]);
  const [out,setOut]=useState<string>("");
  const [busy,setBusy]=useState(false);
  const [speaking,setSpeaking]=useState(true);
  const [listening,setListening]=useState(false);
  const [quota,setQuota]=useState(0);
  const [nudged,setNudged]=useState(false);
  const LIMIT=6;

  const { isAuthenticated, userId } = useAuth();

  const recognitionRef = useRef<any>(null);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  const canListen = typeof window !== "undefined" && (!!window.webkitSpeechRecognition || !!window.SpeechRecognition);

  useEffect(() => {
    async function loadUsage() {
      if (!isAuthenticated || !userId) {
        setQuota(0);
        return;
      }
      try {
        const chatStatus = await DatabaseUsageTracker.canUserChat();
        setQuota(chatStatus.used || 0);
      } catch (error) {
        console.error('Error loading usage:', error);
        setQuota(0);
      }
    }
    loadUsage();
  }, [isAuthenticated, userId]);
  useEffect(()=>{
    const SR = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SR) return;
    const rec = new SR(); rec.lang="en-US"; rec.interimResults=true;
    rec.onresult=(e:any)=>{ let t=""; for(const r of e.results){ t+=r[0].transcript; } setMsg(t); };
    rec.onend=()=>setListening(false); recognitionRef.current=rec;
  },[]);

  function tts(text:string){ if(!canSpeak||!speaking) return; const u=new SpeechSynthesisUtterance(text); u.rate=1.02; u.lang="en-US"; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }

  async function send(){
    // Check authentication
    if (!isAuthenticated) {
      setOut("Please sign in to continue chatting.");
      return;
    }

    // Check usage limits
    try {
      const chatStatus = await DatabaseUsageTracker.canUserChat();
      if (!chatStatus.canChat) {
        setOut("You've reached today's free limit. Book a Clarity Call to go deeper.");
        setNudged(true);
        return;
      }
    } catch (error) {
      console.error('Error checking chat status:', error);
      if (quota >= LIMIT) {
        setOut("You've reached today's free limit. Book a Clarity Call to go deeper.");
        setNudged(true);
        return;
      }
    }

    setBusy(true);
    const r=await fetch("/api/chat",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({message:msg})});
    const j=await r.json(); setOut(j.text||""); setBusy(false); tts(j.text||"");

    // Increment usage in database
    try {
      await DatabaseUsageTracker.incrementUsage();
      const chatStatus = await DatabaseUsageTracker.canUserChat();
      setQuota(chatStatus.used || 0);
    } catch (error) {
      console.error('Error updating usage:', error);
      // Fallback to local increment
      setQuota(prev => prev + 1);
    }

    if (quota >= 3 || /plan|pilot|proposal|budget/i.test((j.text||""))) setNudged(true);
  }

  return (
    <section className="container py-10">
      <h1 className="h1">Quick Chat</h1>
      <p className="muted mt-2">Try it now. {Math.max(0, LIMIT-quota)} replies left today.</p>
      <div className="ui-card p-6 mt-6 space-y-3">
        <select className="w-full rounded bg-white/10 p-2" onChange={e=>setMsg(e.target.value)}>
          {STARTERS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} className="w-full rounded bg白/10 p-3 h-28" />
        <div className="flex flex-wrap gap-3">
          <button onClick={send} disabled={busy} className="btn btn-primary">{busy?"Thinking…":"Send"}</button>
          {canListen && (listening
            ? <button onClick={()=>recognitionRef.current?.stop()} className="btn btn-ghost">Stop Mic</button>
            : <button onClick={()=>{setOut(""); recognitionRef.current?.start(); setListening(true);}} className="btn btn-ghost">Start Mic</button>
          )}
          {canSpeak && <button onClick={()=>setSpeaking(s=>!s)} className="btn btn-ghost">Voice: {speaking?"On":"Off"}</button>}
        </div>
        {out && <div className="prose prose-invert mt-2 whitespace-pre-wrap">{out}</div>}
        <CtaBar show={nudged} />
      </div>
    </section>
  );
}
