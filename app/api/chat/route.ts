import { NextResponse } from "next/server";
import { CatalystPersonality } from "../../lib/coaching/personality";
import { GoalTrackingService } from "../../lib/services/goal-tracking";
// import { supabase } from supabase - temporarily disabled for deployment

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export async function POST(req: Request) {
  const { message, conversationHistory = [], isVoiceConversation = false, coachMode = false } = await req.json();
  const provider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();

  // Check if user is authenticated and get subscription status
  const authHeader = req.headers.get('authorization');
  let isPremium = false;
  let userId = null;

  // Temporarily disabled auth for deployment
  // if (authHeader) {
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  //     if (user) {
  //       userId = user.id;
  //       // Check subscription status
  //       const { data: subscription } = await supabase
  //         .from('user_subscriptions')
  //         .select('tierId')
  //         .eq('userId', user.id)
  //         .eq('status', 'active')
  //         .single();

  //       isPremium = subscription?.tierId === 'plus' || subscription?.tierId === 'catalyst_plus';
  //     }
  //   } catch (error) {
  //     console.log('Auth check failed, proceeding as free user:', error);
  //   }
  // }

  // Generate enhanced system prompt based on user status
  const personalityPrompt = await CatalystPersonality.generateEnhancedPrompt(isPremium);
  let system = personalityPrompt.system_prompt;

  // Coach Mode: Add meta-coaching for AI prompting skills (for both free and premium)
  if (coachMode) {
    system += `

🧠 COACH MODE ACTIVE: You are also teaching the user how to get better results from AI interactions. After answering their question:

1. **Analyze their prompting**: Briefly note what they did well or could improve
2. **Suggest better prompting**: If applicable, show a more effective way to ask
3. **Next steps coaching**: Recommend follow-up questions or approaches
4. **Meta-guidance**: Occasionally share AI interaction best practices

Format coach mode additions like:
---
💡 **Prompting Coach**: [Your analysis and suggestions]
📝 **Try this instead**: "[Better prompt example]"
🎯 **Next steps**: [Recommended follow-ups]

Keep the coaching brief but actionable. Help them become an AI power user.`;
  }

  const messageCount = conversationHistory.length;
  const wantsHelp = /pilot|plan|proposal|briefing|budget|implement|roadmap|strategy|transform|scale/i.test(String(message||""));

  // Enhanced upselling logic with strategic preview hooks and competitor positioning
  async function withSmartNudge(text: string) {
    // No nudge for premium users
    if (isPremium) return text;

    // No nudge for first few exchanges - build rapport first
    if (messageCount < 2) return text;

    // Strategic preview moments - give premium-style response every 5th chat
    const shouldGivePreview = messageCount % 5 === 0 && messageCount >= 5;
    if (shouldGivePreview) {
      return text + `\n\n🔮 **Preview of Catalyst Plus**: If you were upgraded, I'd remember this conversation and reference it in future chats. I'd also track any goals you mentioned and check in on your progress next week.\n\n💭 *"Why pay $20 for ChatGPT when you can get a personal AI coach for $19?"*`;
    }

    // Goal-related conversations get strategic positioning
    const isGoalRelated = /goal|achieve|plan|habit|progress|improve|better|success|growth|change|develop|build|create|learn|master|overcome/i.test(String(message||""));

    if (isGoalRelated && messageCount >= 3) {
      const strategicNudges = [
        `\n\n🎯 **Want me to remember this and help you achieve it?** \n\n**Catalyst Plus vs ChatGPT Plus:**\n• ChatGPT Plus: $20/month for unlimited generic responses\n• Catalyst Plus: $19/month for unlimited coaching that remembers your goals\n\n*Same chat interface, completely different experience.*`,

        `\n\n💡 **I could track this goal and coach you through it!** \n\nCatalyst Plus users get:\n• Personal goal tracking & accountability\n• AI that remembers every conversation\n• Progress insights & milestone celebrations\n\n*For $1 LESS than ChatGPT Plus ($19 vs $20)*`,

        `\n\n🌟 **This sounds important - want me to remember it forever?** \n\nWith Catalyst Plus, I become your personal AI coach who:\n• Never forgets your goals or progress\n• Checks in on your commitments\n• Celebrates your wins\n\n*Better than ChatGPT Plus for less money ($19/month)*`
      ];

      const randomNudge = strategicNudges[Math.floor(Math.random() * strategicNudges.length)];
      return text + randomNudge;
    }

    // Memory teasers for engaged conversations
    if (messageCount >= 4 && messageCount % 7 === 0) {
      return text + `\n\n🧠 **I wish I could remember this conversation...** \n\nChatGPT forgets everything when you close the tab. With Catalyst Plus, I remember every conversation and build on our relationship over time.\n\n*Personal AI coaching for $19/month (less than ChatGPT Plus)*`;
    }

    // Comparison positioning for general questions
    if (messageCount >= 6 && messageCount % 8 === 0) {
      return text + `\n\n💭 **Enjoying our chat?** You're getting ChatGPT-level responses right now. \n\nImagine if I also:\n• Remembered your goals and dreams\n• Checked in on your progress\n• Provided accountability coaching\n• Never forgot our conversations\n\n*That's Catalyst Plus - for $19/month (vs ChatGPT's $20)*`;
    }

    return text;
  }

  // Build message history for context
  function buildMessages(conversationHistory: Message[], currentMessage: string) {
    const messages = [{ role: "system", content: system }];

    // Add conversation history (last 10 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }

    // Add current message
    messages.push({ role: "user", content: String(currentMessage || "") });

    return messages;
  }

  try {
    if (provider === "openai") {
      const messages = buildMessages(conversationHistory, message);
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages
        }),
      });
      const j = await r.json();
      const text = j.choices?.[0]?.message?.content ?? "(no answer)";
      return NextResponse.json({ ok: true, provider, text: await withSmartNudge(text) });
    }

    // Build conversation context for Gemini
    function buildGeminiPrompt(conversationHistory: Message[], currentMessage: string) {
      let prompt = system + "\n\n";

      // Add conversation history (last 10 messages)
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        const role = msg.role === 'user' ? 'USER' : 'ASSISTANT';
        prompt += `${role}: ${msg.content}\n\n`;
      }

      prompt += `USER: ${String(currentMessage || "")}`;
      return prompt;
    }

    const geminiPrompt = buildGeminiPrompt(conversationHistory, message);
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
        generationConfig: { temperature: 0.3 },
      }),
    });
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no answer)";
    return NextResponse.json({ ok: true, provider, text: await withSmartNudge(text) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "LLM error" }, { status: 500 });
  }
}
