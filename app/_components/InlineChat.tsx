"use client";
import { useEffect, useRef, useState } from "react";
import CtaBar from "./CtaBar";
import { DatabaseUsageTracker } from "../lib/subscription/database-usage";
import { useAuth } from "../lib/hooks/useAuth";

declare global { interface Window { webkitSpeechRecognition?: any; SpeechRecognition?: any; } }

export default function InlineChat({ limit = 4, initial = "" }: { limit?: number; initial?: string }) {
  const [msg,setMsg]=useState(initial || "Give me 3 ways AI could save me 2 hours this week.");
  const [out,setOut]=useState<string>("");
  const [busy,setBusy]=useState(false);
  const [speaking,setSpeaking]=useState(true);
  const [listening,setListening]=useState(false);
  const [quota,setQuota]=useState(0);
  const [nudged,setNudged]=useState(false);

  const { isAuthenticated, userId } = useAuth();

  const SRRef = useRef<any>(null);
  const [canSpeak, setCanSpeak] = useState(false);
  const [canListen, setCanListen] = useState(false);

  useEffect(()=>{ if (initial) setMsg(initial); },[initial]);

  // Set client-side capabilities after mount
  useEffect(() => {
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window);
    setCanListen(typeof window !== "undefined" && (!!window.webkitSpeechRecognition || !!window.SpeechRecognition));
  }, []);

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
    rec.onresult = (e:any)=>{ let t=""; for(const r of e.results){ t+=r[0].transcript; } setMsg(t); };
    rec.onend = ()=> setListening(false);
    SRRef.current = rec;
  },[]);

  function speak(text:string){
    if (!canSpeak || !speaking) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate=1.02; u.pitch=1; u.lang="en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

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
        setOut("You've reached your usage limit. Please upgrade to continue.");
        setNudged(true);
        return;
      }
    } catch (error) {
      console.error('Error checking chat status:', error);
      if (quota >= limit) {
        setOut("You've reached your usage limit. Please upgrade to continue.");
        setNudged(true);
        return;
      }
    }

    setBusy(true);
    const r = await fetch("/api/chat",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({message:msg})});
    const j = await r.json();
    setOut(j.text || ""); setBusy(false); speak(j.text || "");

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

    if (quota >= 2 || /plan|pilot|proposal|budget/i.test((j.text||""))) setNudged(true);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#11161d] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <input value={msg} onChange={e=>setMsg(e.target.value)} className="w-full rounded bg-white/10 p-3" />
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <button onClick={send} disabled={busy} className="btn btn-primary">{busy?"Thinking…":"Send"}</button>
        {canListen && (listening
          ? <button onClick={()=>SRRef.current?.stop()} className="btn btn-ghost">Stop Mic</button>
          : <button onClick={()=>{setOut(""); SRRef.current?.start(); setListening(true);}} className="btn btn-ghost">Start Mic</button>
        )}
        {canSpeak && <button onClick={()=>setSpeaking(s=>!s)} className="btn btn-ghost">Voice: {speaking?"On":"Off"}</button>}
        <span className="text-xs text-white/50">Replies so far: {quota}</span>
      </div>
      {out && <div className="prose prose-invert mt-3 whitespace-pre-wrap">{out}</div>}
      <CtaBar show={nudged} />
    </div>
  );
}
