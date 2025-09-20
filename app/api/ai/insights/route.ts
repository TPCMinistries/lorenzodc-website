import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (text.length < 100) {
      return NextResponse.json(
        { error: 'Text too short to analyze' },
        { status: 400 }
      );
    }

    // Generate insights using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert document analyst. Extract 3-5 key insights from the provided document.

Guidelines:
- Focus on actionable insights, important trends, or notable findings
- Each insight should be 1-2 sentences
- Return insights as a JSON array of strings
- Only extract insights that are explicitly supported by the document content
- Prioritize business-relevant or strategically important information`
        },
        {
          role: 'user',
          content: `Please extract key insights from this document:\n\n${text.slice(0, 4000)}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No insights generated');
    }

    // Try to parse as JSON array, fallback to splitting by newlines
    let insights: string[];
    try {
      insights = JSON.parse(response);
    } catch {
      // If not valid JSON, split by newlines and clean up
      insights = response
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10)
        .slice(0, 5);
    }

    return NextResponse.json({ insights });

  } catch (error) {
    console.error('Insights generation error:', error);

    if ((error as any)?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}