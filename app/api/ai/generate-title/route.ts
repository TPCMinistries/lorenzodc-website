import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { conversation } = await request.json();

    if (!conversation || typeof conversation !== 'string') {
      return NextResponse.json(
        { error: 'Conversation content is required' },
        { status: 400 }
      );
    }

    // Generate a concise title using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at creating concise, descriptive titles for conversations.

Guidelines:
- Create a title that captures the main topic or theme of the conversation
- Keep it under 8 words and professional
- Focus on the primary subject matter, not the fact that it's a conversation
- Avoid generic words like "chat", "discussion", "conversation"
- Use specific, actionable language when possible

Examples:
- "Career Transition Strategy"
- "Q4 Revenue Planning"
- "Work-Life Balance Improvement"
- "Team Leadership Development"
- "Product Launch Roadmap"`
        },
        {
          role: 'user',
          content: `Please create a concise title for this conversation:\n\n${conversation.slice(0, 1000)}`
        }
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    const title = completion.choices[0]?.message?.content?.trim();

    if (!title) {
      throw new Error('No title generated');
    }

    // Clean up the title (remove quotes if present)
    const cleanTitle = title.replace(/^["'](.*)["']$/, '$1');

    return NextResponse.json({ title: cleanTitle });

  } catch (error) {
    console.error('Title generation error:', error);

    if ((error as any)?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Fallback to simple title generation
    const { conversation } = await request.json();
    const fallbackTitle = generateFallbackTitle(conversation);

    return NextResponse.json({ title: fallbackTitle });
  }
}

function generateFallbackTitle(conversation: string): string {
  const firstLine = conversation.split('\n')[0] || conversation;
  const userMessage = firstLine.replace(/^(user|assistant):\s*/i, '').trim();

  // Simple keyword-based title generation
  const keywords = {
    'goal': 'Goal Setting',
    'business': 'Business Strategy',
    'career': 'Career Development',
    'personal': 'Personal Growth',
    'document': 'Document Review',
    'assessment': 'Assessment Discussion',
    'plan': 'Planning Session',
    'strategy': 'Strategic Planning',
    'leadership': 'Leadership Development',
    'team': 'Team Management',
    'revenue': 'Revenue Planning',
    'finance': 'Financial Planning',
    'marketing': 'Marketing Strategy',
    'sales': 'Sales Strategy',
    'product': 'Product Development'
  };

  const lowerMessage = userMessage.toLowerCase();

  for (const [keyword, title] of Object.entries(keywords)) {
    if (lowerMessage.includes(keyword)) {
      return title;
    }
  }

  // Default fallback - use first few words
  const words = userMessage.split(' ').slice(0, 4);
  const title = words.join(' ');

  return title.length > 30 ? 'New Conversation' : title;
}