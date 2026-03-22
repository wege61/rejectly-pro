import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role, company } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    const systemPrompt = `You are an expert executive resume writer. 
Generate exactly 4 highly professional, ATS-optimized ATS bullet points for the role of "${role}"${company ? ` at "${company}"` : ""}.
CRITICAL RULES FOR REALISM & LOGIC:
1. Provide the 4 most logical, rational, and real-world accurate bullet points for a person in this exact role. Focus on the core, impactful tasks this professional would ACTUALLY perform on a day-to-day basis.
2. DO NOT INVENT FAKE NUMBERS. If a responsibility naturally demands a metric to prove scale or impact (like revenue, team size, or efficiency gain), use bracketed placeholders like [X], [percentage]%, [number], or [amount].
3. DO NOT FORCE METRICS where they don't belong. If an achievement or duty is purely qualitative, strategic, or regulatory, write it powerfully and realistically without forcing unnecessary placeholders.
4. The goal is maximum realism. The suggestions must look exactly like they belong on the CV of a highly competent professional in that specific industry.

Example (Quantifiable): "Spearheaded the development of a new CRM feature, increasing lead conversion by [X]% within [Y] months."
Example (Qualitative): "Architected a scalable microservices infrastructure to ensure seamless high-availability during peak deployment cycles."

Return your response ONLY as a JSON object in this exact exact format:
{
  "bullets": [
    "bullet 1",
    "bullet 2",
    "bullet 3",
    "bullet 4"
  ]
}
`;

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
      const errorData = await response.text();
      console.error("OpenAI API Error:", errorData);
      return NextResponse.json({ error: "OpenAI API Error" }, { status: 500 });
    }

    const data = await response.json();
    let bullets: string[] = [];
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      bullets = parsed.bullets || [];
    } catch (e) {
      console.error("Parse Error:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error("AI Bullet Gen Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
