import { openai, AI_MODEL } from "./src/lib/ai/client";
import { generateAtsReadabilityPrompt } from "./src/app/api/ats-readability/route";
import { generateBulletAnalysisPrompt } from "./src/app/api/bullet-analysis/route";
import { generateSystematicScoringPrompt } from "./src/lib/ai/prompts";

async function run() {
  console.log("Starting test...");
  try {
    const cvText = "Fake CV text software engineer barista";
    const jobTexts = ["Fake job description software engineer barista"];
    
    const atsPrompt = generateAtsReadabilityPrompt(cvText, jobTexts);
    const bulletPrompt = generateBulletAnalysisPrompt(cvText);
    const mainPrompt = generateSystematicScoringPrompt(cvText, jobTexts);

    console.log("Sending concurrent requests to OpenAI...");
    const [mainCompletion, atsCompletion, bulletCompletion] = await Promise.all([
      openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: "user", content: mainPrompt }],
        temperature: 0.5,
        max_tokens: 2500,
        response_format: { type: "json_object" },
      }),
      openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: "user", content: atsPrompt }],
        temperature: 0.3,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
      openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: "user", content: bulletPrompt }],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" },
      })
    ]);

    console.log("Success!");
    console.log("ATS:", atsCompletion.choices[0].message.content?.substring(0, 50));
  } catch (err: any) {
    console.error("FAILED:", err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

run();
