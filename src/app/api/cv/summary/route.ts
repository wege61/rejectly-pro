import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { experience = [], education = [], certifications = [], skills = [], focus = 'experience' } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    const expStrings = experience.map((e: any) => `${e.title} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'})`);
    const eduStrings = education.map((e: any) => `${e.degree} in ${e.fieldOfStudy} at ${e.institution}`);
    const certStrings = certifications.map((c: any) => c.name);

    const backgroundText = [
      ...(expStrings.length > 0 ? [`Experience:\n- ${expStrings.join('\n- ')}`] : []),
      ...(eduStrings.length > 0 ? [`Education:\n- ${eduStrings.join('\n- ')}`] : []),
      ...(certStrings.length > 0 ? [`Certifications:\n- ${certStrings.join('\n- ')}`] : []),
      ...(skills.length > 0 ? [`Skills: ${skills.join(', ')}`] : [])
    ].join('\n\n');

    const finalBackgroundText = backgroundText || "No specific background provided. Generate general professional summaries.";

    const focusInstruction = focus === 'education' 
      ? `CRITICAL FOCUS: EDUCATION & ACADEMICS. 
The user is likely a recent graduate. You MUST build the summary almost entirely around their Education, degrees, academic foundation, and technical skills. 
STRICLY IGNORE any unrelated part-time, retail, or survival jobs in their Experience section. Only mention work experience if it is highly relevant to their field of study. Frame their value proposition around their academic achievements, potential, and readiness to transition into a professional role.`
      : `CRITICAL FOCUS: PROFESSIONAL EXPERIENCE. 
Heavily prioritize their Work Experience, job titles, and career trajectory. Frame the summary around their proven track record, leadership, and direct industry impact.`;

    const systemPrompt = `You are a world-class executive resume writer. 
Based on the following comprehensive background profile of the user:

${finalBackgroundText}

${focusInstruction}

Write 3 distinct, highly professional, and ATS-optimized "Professional Summaries" (to go at the very top of their CV).
Each summary MUST be between 3 to 5 sentences long.
Highlight their distinct value proposition, drawing upon any notable companies, high-level skills, or years of experience evident in the data.

Provide 3 variations:
1. "Executive": Focus on leadership, big-picture impact, and strategic value.
2. "Technical/Action": Focus on hard skills, methodologies, execution and delivering direct results.
3. "Dynamic/Story": A slightly more modern, compelling narrative about their passion and drive, without being cheesy.

DO NOT use "I", "Me", "My" or "We" (third-person implied is best, e.g., "Results-driven Software Engineer with 5+ years of experience...").

Return your response ONLY as a JSON object in this exact format:
{
  "suggestions": [
    "Summary draft 1...",
    "Summary draft 2...",
    "Summary draft 3..."
  ]
}
Do not include markdown or explanations outside the JSON.`;

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
    let suggestions: string[] = [];
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      suggestions = parsed.suggestions || [];
    } catch (e) {
      console.error("Parse Error:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI Summary Gen Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
