import { generateProReportPrompt } from "./src/lib/ai/prompts";
import { openai } from "./src/lib/ai/client";
import * as fs from "fs";

async function testPrompt() {
  const cvText = fs.readFileSync("./public/dummy_weak_cv.txt", "utf-8");
  const jobText = fs.readFileSync("./public/dummy_job.txt", "utf-8");

  const prompt = generateProReportPrompt(cvText, [jobText], "en");

  console.log("SENDING TO OPENAI...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: prompt + "\n\nReturn the result in JSON format.",
      }
    ],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    console.error("No content from OpenAI");
    return;
  }

  const result = JSON.parse(content);
  console.log("\n\n=== GENERATED METRIC QUESTIONS ===");
  console.log(JSON.stringify(result.metricQuestions, null, 2));
}

testPrompt().catch(console.error);
