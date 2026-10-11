import { NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/ai/client';
import { guardBuilderAIRequest } from '@/lib/ai/builderGuard';

export async function POST(req: Request) {
  try {
    const guard = await guardBuilderAIRequest(req);
    if ("response" in guard) return guard.response;
    const { text, role, company } = guard.body as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    const context = role ? `for a ${role}${company ? ` at ${company}` : ''}` : '';

    const systemPrompt = `You are an expert executive resume writer. 
The user has written a rough draft of a resume bullet point ${context}. 
Your job is to rewrite this rough draft into a SINGLE highly professional, ATS-optimized bullet point using strong action verbs.

CRITICAL RULES:
1. **STUDENT WORK**: If the draft describes class or group work (e.g., "I made a website for a class", "We used React in our group project"), rewrite it as clear project experience ("Built a React web application in a 4-person team") without classroom wording. Keep the real scope: don't upgrade "helped" to "led" or a class project to "enterprise".
2. Do not invent fake metrics or data that the user didn't provide. Use only the facts provided.
3. If no metrics are provided, just rewrite the sentence professionally without any placeholders or brackets.
4. Return ONLY a JSON object in this exact format: { "bullet": "The polished bullet point string" }
5. Do not include markdown or explanations.

User's Draft: "${text}"`;

    const data = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: 'system' as const, content: systemPrompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
    let bullet = "";
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content || "{}");
      bullet = parsed.bullet || "";
    } catch (e) {
      console.error("Parse Error:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ bullet });
  } catch (error) {
    console.error("AI Polish Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
