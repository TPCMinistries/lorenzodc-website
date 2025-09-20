import { NextResponse } from "next/server";

export async function POST(req: Request){
  const { teamSize, hourlyCost, tasksPerWeek, minutesSaved, errorRate, costPerError } = await req.json();

  const hoursSavedMo = (teamSize || 0) * (tasksPerWeek || 0) * 4 * ((minutesSaved || 0)/60);
  const errorsAvoidedMo = (teamSize || 0) * (tasksPerWeek || 0) * 4 * (errorRate || 0);

  const monthlySavings = (hoursSavedMo * (hourlyCost || 0)) + (errorsAvoidedMo * (costPerError || 0));
  const annualHours = Math.round(hoursSavedMo * 12);
  const annualSavings = Math.round(monthlySavings * 12);

  const pilotCost = 15000; // tweak later
  const paybackMonths = monthlySavings > 0 ? pilotCost / monthlySavings : null;

  return NextResponse.json({
    ok: true,
    hoursSavedMonth: Math.round(hoursSavedMo),
    monthlySavings: Math.round(monthlySavings),
    hoursSavedYear: annualHours,
    annualSavings,
    paybackMonths,
  });
}
