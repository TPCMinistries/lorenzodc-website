import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { texts } = await request.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Texts array is required' },
        { status: 400 }
      );
    }

    if (texts.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 texts per request' },
        { status: 400 }
      );
    }

    // Generate embeddings using OpenAI
    const embeddings = [];

    for (const text of texts) {
      if (typeof text !== 'string' || text.trim().length === 0) {
        embeddings.push(null);
        continue;
      }

      try {
        const response = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: text.slice(0, 8000), // Limit text length for API
        });

        embeddings.push(response.data[0].embedding);
      } catch (error) {
        console.error('Error generating embedding for text:', error);
        embeddings.push(null);
      }

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return NextResponse.json({ embeddings });

  } catch (error) {
    console.error('Embedding generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate embeddings' },
      { status: 500 }
    );
  }
}