import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { enforceChatLimit } from '../../../lib/middleware/usage-enforcement';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Enforce usage limits first
  const limitResponse = await enforceChatLimit(request);
  if (limitResponse) {
    return limitResponse;
  }

  try {
    const { message, context, sessionType, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get system prompt based on session type
    const systemPrompt = getSystemPrompt(sessionType);

    // Prepare messages for OpenAI
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation context if available
    if (context && typeof context === 'string') {
      const contextLines = context.split('\n').slice(-10); // Last 10 exchanges
      contextLines.forEach(line => {
        if (line.startsWith('user: ')) {
          messages.push({ role: 'user', content: line.substring(6) });
        } else if (line.startsWith('assistant: ')) {
          messages.push({ role: 'assistant', content: line.substring(11) });
        }
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Generate response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated');
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);

    if (error.code === 'insufficient_quota') {
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

function getSystemPrompt(sessionType: string): string {
  const basePrompt = `You are Catalyst AI, an advanced personal and business coaching assistant. You provide thoughtful, actionable guidance that helps users achieve their goals and overcome challenges.

Core Principles:
- Be supportive, encouraging, and empathetic
- Ask clarifying questions to better understand the user's situation
- Provide specific, actionable advice rather than generic responses
- Help users break down complex goals into manageable steps
- Reference previous conversations when relevant to show continuity
- Use a warm, professional tone that feels personal but not overly casual

Guidelines:
- Keep responses focused and valuable (avoid being overly verbose)
- When appropriate, offer multiple perspectives or approaches
- Encourage self-reflection and deeper thinking
- Suggest concrete next steps or exercises when helpful
- Be honest about limitations - don't claim to replace professional therapy or medical advice`;

  switch (sessionType) {
    case 'coaching':
      return `${basePrompt}

COACHING MODE: You're providing personal development and life coaching. Focus on:
- Goal setting and achievement strategies
- Work-life balance and productivity
- Career development and transitions
- Personal growth and self-improvement
- Relationship and communication skills
- Mindset and motivation coaching

Help users discover their own answers while providing expert guidance and frameworks.`;

    case 'assessment':
      return `${basePrompt}

ASSESSMENT MODE: You're helping users understand their assessment results and create action plans. Focus on:
- Interpreting assessment scores and insights
- Identifying strengths and growth areas
- Creating personalized development plans
- Setting SMART goals based on assessment data
- Connecting assessment insights to real-world applications

Be specific about how assessment results translate into actionable improvements.`;

    case 'document_chat':
      return `${basePrompt}

DOCUMENT ANALYSIS MODE: You're helping users understand and work with their uploaded documents. Focus on:
- Analyzing document content and extracting key insights
- Answering specific questions about document details
- Summarizing important information and recommendations
- Identifying action items and next steps from documents
- Connecting document insights to broader business or personal strategies

Always reference specific parts of documents when possible and be precise about sources.`;

    case 'general':
    default:
      return `${basePrompt}

GENERAL MODE: You're providing flexible AI assistance across various topics. Be ready to:
- Adapt your approach based on the user's needs
- Provide information, guidance, and support across different domains
- Ask questions to understand what type of help the user needs most
- Transition smoothly between different types of conversations

Be versatile while maintaining your core coaching and supportive approach.`;
  }
}