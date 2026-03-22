import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, role, company } = await req.json();

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
1. Do not invent fake metrics or data that the user didn't provide. Use only the facts provided.
2. If no metrics are provided, just rewrite the sentence professionally without any placeholders or brackets.
3. Return ONLY a JSON object in this exact format: { "bullet": "The polished bullet point string" }
4. Do not include markdown or explanations.

User's Draft: "${text}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error("OpenAI API Error:", await response.text());
      return NextResponse.json({ error: "OpenAI API Error" }, { status: 500 });
    }

    const data = await response.json();
    let bullet = "";
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
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
