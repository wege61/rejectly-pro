import { generateOptimizedCVPrompt } from './src/lib/ai/prompts/cvOptimization.js';
import * as fs from 'fs';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const cvText = fs.readFileSync('terrible_cv.md', 'utf-8');
  const jobText = fs.readFileSync('sample_job_posting.md', 'utf-8');

  // Realistic mock analysis
  const analysisResults = {
    fitScore: 20,
    summary: "Extremely poor formatting. No clear action verbs, no metrics, missing almost all keywords.",
    missingKeywords: ["React", "Next.js", "TypeScript", "Redux", "Jest", "Cypress", "Tailwind CSS", "CI/CD"],
  };

  const prompt = generateOptimizedCVPrompt(
    cvText,
    [jobText],
    analysisResults,
    false, 
    ["JavaScript"], // only confirming basic JS
    [], 
    '', 
    'English'
  );

  console.log('Sending Terrible CV to OpenAI for Optimization...');
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: "system",
        content: `You are an expert CV writer. You MUST write the entire CV in English.`
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.85,
    response_format: { type: "json_object" },
  });

  const rawGeneratedCV = JSON.parse(completion.choices[0].message.content || "{}");
  fs.writeFileSync('optimized_terrible_cv.json', JSON.stringify(rawGeneratedCV, null, 2));
  console.log('✅ Wrote optimized_terrible_cv.json');
}

main().catch(console.error);
