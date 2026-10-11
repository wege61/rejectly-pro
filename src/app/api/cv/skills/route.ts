import { NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/ai/client';
import { guardBuilderAIRequest } from '@/lib/ai/builderGuard';

export async function POST(req: Request) {
  try {
    const guard = await guardBuilderAIRequest(req);
    if ("response" in guard) return guard.response;
    const { experience = [], education = [], certifications = [] } = guard.body as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    // Extract key details to save tokens and focus the AI
    const expStrings = experience.map((e: any) => `${e.title || 'Professional'} at ${e.company || 'Company'}`);
    const eduStrings = education.map((e: any) => `${e.degree || 'Degree'} ${e.fieldOfStudy ? `in ${e.fieldOfStudy}` : ''} at ${e.institution || 'Institution'}`);
    const certStrings = certifications.map((c: any) => c.name);

    const backgroundText = [
      ...(expStrings.length > 0 ? [`Experience: ${expStrings.join(', ')}`] : []),
      ...(eduStrings.length > 0 ? [`Education: ${eduStrings.join(', ')}`] : []),
      ...(certStrings.length > 0 ? [`Certifications: ${certStrings.join(', ')}`] : [])
    ].join('\n');

    const finalBackgroundText = backgroundText || "No specific background provided. Suggest 12 general professional skills.";

    const systemPrompt = `You are an expert executive resume writer and career coach.
Based on the following user background:
${finalBackgroundText}

Suggest skills this person can credibly list, grouped by where they developed them (Experience, Education, Certifications). Only suggest skills that the background states or that the described work clearly required (e.g. "built React dashboards" → React, JavaScript). Never suggest a tool the background gives no evidence for.
CRITICAL RULES:
1. DO NOT use generic fluff like "Hardworker" or "Team Player". 
2. Use professional, ATS-optimized resume keywords.
3. Return your response ONLY as a JSON object in this exact format:
{
  "experienceSkills": ["Skill 1", "Skill 2"],
  "educationSkills": ["Skill 3", "Skill 4"],
  "certificationSkills": ["Skill 5", "Skill 6"]
}
If the user did not provide Experience, Education, or Certifications, leave that specific array empty. Return at most 15 skills in total; fewer is fine when the background is short.
4. Do not include markdown, explanations, or lists outside the JSON.`;

    const data = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: 'system' as const, content: systemPrompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
    let dataObj = { experienceSkills: [], educationSkills: [], certificationSkills: [] };
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content || "{}");
      dataObj = {
        experienceSkills: parsed.experienceSkills || [],
        educationSkills: parsed.educationSkills || [],
        certificationSkills: parsed.certificationSkills || []
      };
    } catch (e) {
      console.error("Parse Error:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json(dataObj);
  } catch (error) {
    console.error("AI Skills Gen Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
