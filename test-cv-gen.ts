import { generateOptimizedCVPrompt } from "./src/lib/ai/prompts";
import { openai } from "./src/lib/ai/client";
import * as fs from "fs";

async function testGeneration() {
  const cvText = fs.readFileSync("./public/dummy_weak_cv.txt", "utf-8");
  const jobText = fs.readFileSync("./public/dummy_job.txt", "utf-8");

  const userMetrics = {
    "metric_1": "Increased sales volume by 45%",
    "metric_2": "$15,000 quarterly budget"
  };

  const prompt = generateOptimizedCVPrompt(
    cvText,
    [jobText],
    { fitScore: 60, summary: "Okay fit", missingKeywords: [] },
    false,
    [],
    [],
    "",
    "English",
    userMetrics
  );

  console.log("SENDING TO OPENAI FOR CV GENERATION...");
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: prompt + "\n\nReturn the result in JSON format."
      }
    ],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  console.log("\n\n=== GENERATED CV ===");
  if (content) {
     const result = JSON.parse(content);
     console.log(JSON.stringify(result.experience, null, 2));
  }
}

testGeneration().catch(console.error);
