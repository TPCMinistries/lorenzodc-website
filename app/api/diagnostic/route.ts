// app/api/diagnostic/route.ts
import { NextResponse } from "next/server";

type Tier = "Foundations" | "Pilot Ready" | "Scale Path" | "Acceleration";

export async function POST(req: Request) {
  const { answers } = await req.json();

  // weights nudge strategy/measurement/security/budget slightly higher
  const weights: Record<string, number> = {
    Strategy: 1.2, Data: 1.1, Process: 1.0, People: 1.0,
    Security: 1.1, Tooling: 0.9, Workflow: 1.0, Measurement: 1.2,
    "Change Mgmt": 1.0, Budget: 1.1,
  };

  const pairs = Object.entries(answers ?? {}) as [string, number][];
  const sumW = pairs.reduce((s,[k]) => s + (weights[k] ?? 1), 0);
  const wAvg = sumW
    ? pairs.reduce((s,[k,v]) => s + (v * (weights[k] ?? 1)), 0) / sumW
    : 0;

  const score = Math.max(0, Math.min(50, Math.round(wAvg * 10)));

  const tier: Tier =
    score < 16 ? "Foundations" :
    score < 31 ? "Pilot Ready" :
    score < 41 ? "Scale Path" : "Acceleration";

  const plans = {
    Foundations: [
      "Publish AI policy (privacy, PII, vendor review)",
      "Run a 2-hour starter training",
      "Automate one SOP end-to-end"
    ],
    "Pilot Ready": [
      "Lock 90-day pilot scope (1–2 use cases)",
      "Baseline hours saved / error rates",
      "Define tool list & access"
    ],
    "Scale Path": [
      "Blueprint for 2–3 teams",
      "Connect data sources (docs/BI) safely",
      "Set cross-team KPIs"
    ],
    Acceleration: [
      "Stand up an AI Center of Excellence",
      "Platformize & templatize workflows",
      "Quarterly governance review"
    ],
  } as const;

  // surface top gaps (lowest ratings first)
  const gaps = [...pairs]
    .sort((a,b) => a[1] - b[1])
    .slice(0,3)
    .map(([k,v]) => `${k}: ${v}/5`);

  return NextResponse.json({
    ok: true,
    score, tier,
    roadmap: plans[tier],
    explain: {
      weightedAverage: wAvg.toFixed(2),
      topGaps: gaps,
    },
  });
}
