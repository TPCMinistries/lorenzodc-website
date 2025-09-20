import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Numerology calculations
function calculateLifePath(birthDate: string): number {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const sum = day + month + year;
  return reduceToSingleDigit(sum);
}

function calculateExpressionNumber(fullName: string): number {
  const letterValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const sum = cleanName.split('').reduce((acc, letter) => acc + (letterValues[letter] || 0), 0);
  return reduceToSingleDigit(sum);
}

function calculatePersonalYear(birthDate: string): number {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const sum = day + month + currentYear;
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

// Astrological calculations
function getZodiacSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  return "Unknown";
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "Spring - Growth and New Beginnings";
  if (month >= 6 && month <= 8) return "Summer - Expansion and Action";
  if (month >= 9 && month <= 11) return "Fall - Harvest and Preparation";
  return "Winter - Reflection and Strategic Planning";
}

// Determine spiritual openness based on responses
function assessSpiritualOpenness(data: any): 'high' | 'moderate' | 'low' {
  const spiritualIndicators = [
    data.spiritualBackground?.length > 50,
    data.currentVision?.toLowerCase().includes('calling') || data.currentVision?.toLowerCase().includes('divine') || data.currentVision?.toLowerCase().includes('purpose'),
    data.primaryFocus?.includes('Ministry'),
    data.communityInterest?.includes('Ministry Community')
  ];

  const spiritualScore = spiritualIndicators.filter(Boolean).length;
  if (spiritualScore >= 3) return 'high';
  if (spiritualScore >= 1) return 'moderate';
  return 'low';
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Calculate spiritual numbers
    const lifePath = calculateLifePath(data.birthDate);
    const expression = calculateExpressionNumber(data.fullName);
    const personalYear = calculatePersonalYear(data.birthDate);
    const zodiacSign = getZodiacSign(data.birthDate);
    const currentSeason = getCurrentSeason();
    const spiritualOpenness = assessSpiritualOpenness(data);

    // Create AI prompt based on spiritual openness
    const systemPrompt = spiritualOpenness === 'high'
      ? `You are a divine strategy consultant with deep prophetic insight and business acumen. You integrate spiritual discernment with systematic implementation. You understand numerology, astrology, and spiritual seasons as tools for divine guidance. Present insights as both spiritual and strategic counsel.`
      : spiritualOpenness === 'moderate'
      ? `You are a strategic consultant who understands that the most successful leaders integrate spiritual wisdom with practical implementation. You respect both faith and systematic approaches. Present insights as spiritually-informed strategic guidance.`
      : `You are an advanced strategic consultant specializing in visionary leadership and systematic implementation. You understand timing, seasons, and the deeper patterns that drive successful transformation. Present insights as sophisticated strategic analysis.`;

    const userPrompt = `
STRATEGIC ANALYSIS REQUEST:

Personal Profile:
- Name: ${data.fullName}
- Life Path Number: ${lifePath}
- Expression Number: ${expression}
- Personal Year: ${personalYear}
- Zodiac Sign: ${zodiacSign}
- Current Season: ${currentSeason}

Current Situation:
- Primary Focus: ${data.primaryFocus}
- Current Vision: ${data.currentVision}
- Implementation Challenges: ${data.implementationChallenges}
- Seasonal Assessment: ${data.seasonalAssessment}
- Strategic Priorities: ${data.strategicPriorities}

Background:
- Leadership Experience: ${data.leadershipExperience}
- Spiritual Background: ${data.spiritualBackground}
- Business Experience: ${data.businessExperience}
- Education: ${data.educationalBackground}

Expectations:
- Desired Outcomes: ${data.desiredOutcomes}
- Timeline: ${data.timelineConsiderations}
- Investment Level: ${data.investmentLevel}
- Community Interest: ${data.communityInterest}

Please provide comprehensive strategic guidance that addresses:

1. DIVINE ASSIGNMENT CLARITY: Based on their profile and numbers, what is their core calling and how should they approach it systematically?

2. CURRENT SEASON ANALYSIS: What phase are they in spiritually and strategically? What should be their focus right now?

3. IMPLEMENTATION STRATEGY: Specific, actionable steps for the next 90 days that honor both spiritual timing and practical progress.

4. SYSTEMATIC APPROACH: How can they build sustainable systems around their vision?

5. NEXT LEVEL PREPARATION: What they need to develop or strengthen before their next expansion phase.

Present this as personalized, actionable guidance that feels remarkably accurate and divinely inspired while being practically implementable. Use ${spiritualOpenness === 'high' ? 'spiritual and prophetic language' : spiritualOpenness === 'moderate' ? 'spiritually-informed business language' : 'sophisticated strategic language'}.

Length: 800-1200 words of comprehensive, specific guidance.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500
    });

    const guidance = completion.choices[0]?.message?.content || "Unable to generate guidance at this time.";

    // Initiate lead nurturing sequence
    const { LeadNurturingService } = await import("../../lib/services/lead-nurturing");

    const leadData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      primaryFocus: data.primaryFocus,
      investmentLevel: data.investmentLevel,
      spiritualOpenness,
      leadSource: 'strategic_clarity_assessment'
    };

    // Start immediate follow-up sequence
    LeadNurturingService.initiateAssessmentFollowUp(leadData, guidance).catch(console.error);

    return NextResponse.json({
      guidance,
      metadata: {
        lifePath,
        expression,
        personalYear,
        zodiacSign,
        currentSeason,
        spiritualOpenness
      }
    });

  } catch (error) {
    console.error('Spiritual guidance generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate spiritual guidance' },
      { status: 500 }
    );
  }
}