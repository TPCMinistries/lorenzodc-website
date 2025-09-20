import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, query, documentId } = await request.json();

    if (!prompt || !query) {
      return NextResponse.json(
        { error: 'Prompt and query are required' },
        { status: 400 }
      );
    }

    // Generate AI response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI assistant helping users analyze and understand their documents.

Key Guidelines:
- Always base your answers on the provided document content
- If information isn't in the document, clearly state that
- Be specific and reference page numbers or sections when possible
- Provide actionable insights when appropriate
- Keep responses focused and helpful
- Use a professional but friendly tone`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated');
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Document chat error:', error);

    if ((error as any)?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}