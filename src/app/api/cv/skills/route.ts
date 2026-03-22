import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { experience = [], education = [], certifications = [] } = await req.json();

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

Generate highly relevant skills for this person grouped by where they most likely developed them (Experience, Education, Certifications).
CRITICAL RULES:
1. DO NOT use generic fluff like "Hardworker" or "Team Player". 
2. Use professional, ATS-optimized resume keywords.
3. Return your response ONLY as a JSON object in this exact format:
{
  "experienceSkills": ["Skill 1", "Skill 2"],
  "educationSkills": ["Skill 3", "Skill 4"],
  "certificationSkills": ["Skill 5", "Skill 6"]
}
If the user did not provide Experience, Education, or Certifications, leave that specific array empty. Total skills across all categories should be around 12-15.
4. Do not include markdown, explanations, or lists outside the JSON.`;

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
    let dataObj = { experienceSkills: [], educationSkills: [], certificationSkills: [] };
    
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
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
