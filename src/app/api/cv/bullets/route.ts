import { NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/ai/client';
import { guardBuilderAIRequest, BUILDER_OUTPUT_TOKENS } from '@/lib/ai/builderGuard';

export async function POST(req: Request) {
  try {
    const guard = await guardBuilderAIRequest(req);
    if ("response" in guard) return guard.response;
    const { role, company } = guard.body as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    const systemPrompt = `You are an expert executive resume writer. 
Generate exactly 4 highly professional, ATS-optimized bullet points for the role or project of "${role}"${company ? ` at "${company}"` : ""}.
CRITICAL RULES FOR REALISM & LOGIC:
1. Provide the 4 most logical, rational, and real-world accurate bullet points for a person in this exact role. 
2. **NEW GRAD PROJECTS**: If the role/company sounds like a university project, capstone, hackathon, or student club, write it as clear project experience ("Built a full-stack web application with React and Node.js") rather than classroom wording ("Built a project for class"). Keep the scope realistic for a student project: no "architected", "enterprise", or leadership claims.
3. DO NOT INVENT FAKE NUMBERS. If a responsibility naturally demands a metric to prove scale or impact (like users, API calls, or efficiency gain), use bracketed placeholders like [X], [percentage]%, or [number].
4. DO NOT FORCE METRICS where they don't belong. If an achievement or duty is purely qualitative, write it powerfully and realistically.
5. The goal is maximum realism: typical, specific duties for this role at its real seniority level. Never inflate a junior role into a senior one.

Example (Quantifiable): "Developed the React frontend for the customer portal, reducing page load time by [X]%."
Example (Qualitative): "Built and maintained REST APIs in Node.js for the mobile app."

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

    const data = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: 'system' as const, content: systemPrompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
        max_completion_tokens: BUILDER_OUTPUT_TOKENS.bullets
      });
    let bullets: string[] = [];
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content || "{}");
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
