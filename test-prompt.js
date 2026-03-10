import { generateOptimizedCVPrompt } from './src/lib/ai/prompts/cvOptimization.js';
import * as fs from 'fs';

const cvText = fs.readFileSync('sample_cv.md', 'utf-8');
const jobText = fs.readFileSync('sample_job_posting.md', 'utf-8');

const analysisResults = {
  fitScore: 45,
  summary: "Candidate lacks matching keywords and has poor bullet point structure. No quantified achievements found.",
  missingKeywords: ["Next.js", "TypeScript", "Redux", "Jest", "Cypress", "Tailwind CSS", "CI/CD"],
  rewrittenBullets: [],
  roleRecommendations: [],
  atsFlags: ["Missing measurable achievements", "Weak action verbs", "Used clichés in summary"]
};

// Generate the prompt to see what instructions are sent to the AI
const prompt = generateOptimizedCVPrompt(
  cvText,
  [jobText],
  analysisResults,
  false, // honest mode
  ["Next.js", "Tailwind CSS"], // additional confirmed tools
  [], // no extracted metrics from original CV
  '', // no achievements section
  'English'
);

console.log('======================================================');
console.log('PROMPT SENT TO AI (Notice the NO FAKE METRICS section)');
console.log('======================================================');
console.log(prompt);
