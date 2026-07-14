import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateSystematicScoringPrompt } from './src/lib/ai/prompts/scoring';
import { openai, AI_MODEL } from './src/lib/ai/client';

async function testSkillMatch() {
  const cvText = `
John Doe
Junior Designer
Experience:
- Intern, Some Design Agency (2024)
Education:
- BA in Design, University of Art

Skills:
Adobe Illustrator • Figma • Canva
`;

  const jobText = `
Junior UX/UI Designer
Required Skills: Illustrator, Figma
Experience: 0-2 years
`;

  console.log("Generating prompt...");
  const prompt = generateSystematicScoringPrompt(cvText, [jobText]);

  console.log("Calling OpenAI API...");
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const responseJson = JSON.parse(completion.choices[0].message.content || "{}");
  
  console.log("\n--- TEST RESULTS ---");
  const hardSkills = responseJson.components?.hardSkills || responseJson.components?.skillsMatch;
  console.log("Matched Skills:", JSON.stringify(hardSkills?.matchedSkills || hardSkills?.matchedItems, null, 2));
  console.log("Missing Skills:", JSON.stringify(hardSkills?.missingSkills || hardSkills?.missingItems, null, 2));
  
  const hasIllustrator = JSON.stringify(hardSkills).includes("Illustrator");
  const hasFigma = JSON.stringify(hardSkills).includes("Figma");
  
  if (hasIllustrator && hasFigma && !(hardSkills?.missingSkills || []).some((s: any) => s.skill.includes('Figma'))) {
    console.log("✅ TEST PASSED: Illustrator and Figma were correctly extracted and matched!");
  } else {
    console.error("❌ TEST FAILED: Skills were not matched properly. See output above.");
  }
}

testSkillMatch().catch(console.error);
