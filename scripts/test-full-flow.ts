/**
 * Full Flow Test: CV Optimize -> ATS Check
 * Optimized CV'nin ATS skorunu kontrol eder
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import OpenAI from "openai";
import { generateATSOptimizationPrompt } from "../src/lib/ai/prompts";
import { calculateDeterministicScore, parseCV, calculateParsingCompatibility } from "../src/lib/ats/deterministicScoring";
import { postProcessCVForATS, GeneratedCVData } from "../src/lib/ats/utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Test CV - Senior level, no education date
const testCV = `
Mehmet Kaya
mehmet@email.com
555-987-6543
Ankara, Turkey

Experience:

Senior Software Engineer at BigCorp
2019 - Present
- Led development team
- Was responsible for architecture
- Worked on microservices

Software Developer at StartupXYZ
2016 - 2019
- Helped build features
- Did testing
- Participated in code reviews

Education:
Computer Engineering, METU

Skills:
Python, Java, AWS, Docker
`;

const fakeAtsResult = {
  overallScore: 50,
  categories: {
    format: { issues: [{ issue: "No LinkedIn", fix: "Add LinkedIn" }], passes: [] },
    structure: { issues: [{ issue: "Missing summary", fix: "Add summary" }], passes: [] },
    keywords: { issues: [{ issue: "Weak verbs", fix: "Use power verbs" }], passes: [] },
    readability: { issues: [{ issue: "No metrics", fix: "Add metrics" }], passes: [] },
  },
  topIssues: [
    { issue: "No metrics", suggestion: "Add numbers", category: "readability" },
  ],
  quickWins: ["Add LinkedIn", "Add summary"],
};

async function testFullFlow() {
  console.log("🧪 FULL FLOW TEST\n");
  console.log("=".repeat(60));

  // Step 1: Check original CV score
  console.log("\n📊 STEP 1: Original CV Score");
  const originalScore = calculateDeterministicScore(testCV);
  console.log("   Score: " + originalScore.overallScore + "/100");

  // Step 2: Optimize CV
  console.log("\n🔧 STEP 2: Optimizing CV...");
  const prompt = generateATSOptimizationPrompt(testCV, fakeAtsResult);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const rawOptimizedCV = JSON.parse(completion.choices[0].message.content || "{}");

  // Debug: Show raw skills before processing
  console.log("\n🔧 Raw AI Skills (before processing):");
  console.log("   " + (rawOptimizedCV.skills?.technical?.slice(0, 8).join(", ") || "none"));

  // Apply post-processing (same as optimize route)
  const optimizedCV = postProcessCVForATS(rawOptimizedCV as GeneratedCVData);

  // Step 3: Convert to text format
  const cvText = formatCVAsText(optimizedCV);
  console.log("\n📄 STEP 3: Optimized CV Text Preview:");
  console.log(cvText.substring(0, 1200) + "...\n");

  // Check for REST in text
  if (cvText.includes("REST")) {
    console.log("⚠️ REST found in CV text. Checking if expanded...");
    console.log("   Contains 'Representational State Transfer': " + cvText.includes("Representational State Transfer"));
  }

  // Step 4: Re-check optimized CV
  console.log("📊 STEP 4: Optimized CV Score");
  const optimizedScore = calculateDeterministicScore(cvText);
  const parsedCV = parseCV(cvText);
  const parsingChecks = calculateParsingCompatibility(parsedCV);

  console.log("   Final Score: " + optimizedScore.overallScore + "/100");
  console.log("   Parsing Compatibility: " + parsingChecks.overallCompatibility + "%");

  // Step 5: Check issues
  console.log("\n🔍 STEP 5: Remaining Issues:");
  const allIssues = optimizedScore.topIssues || [];

  if (allIssues.length === 0) {
    console.log("   ✅ NO ISSUES - PERFECT SCORE!");
  } else {
    allIssues.forEach((issue: any, i: number) => {
      console.log("   ❌ " + (i + 1) + ". " + issue.issue);
    });
  }

  // Abbreviation details
  console.log("\n📝 Abbreviation Check:");
  console.log("   Expanded: " + (optimizedScore.abbreviationCheck?.expandedCorrectly?.join(", ") || "none"));
  console.log("   Needs expansion: " + (optimizedScore.abbreviationCheck?.needsExpansion?.join(", ") || "none"));

  // Show skills to debug abbreviation issue
  console.log("\n🛠️ Skills (checking for expanded abbreviations):");
  console.log("   Technical: " + (optimizedCV.skills?.technical?.join(", ") || "none"));

  // Find where REST appears
  const restMatch = cvText.match(/.{0,30}REST.{0,30}/g);
  if (restMatch) {
    console.log("\n🔍 REST context in CV:");
    restMatch.forEach(m => console.log("   " + m.trim()));
  }

  // Step 6: Seniority check (from raw AI response)
  console.log("\n🎯 STEP 6: Seniority Detection:");
  console.log("   Level: " + (rawOptimizedCV.detectedSeniority?.level || "Not detected"));
  console.log("   Strategy: " + (rawOptimizedCV.detectedSeniority?.verbStrategy || "N/A"));

  // Step 7: Date fabrication check
  console.log("\n📅 STEP 7: Date Fabrication Check:");
  const eduDate = optimizedCV.education?.[0]?.graduationDate;
  if (eduDate && eduDate !== null && eduDate !== "null") {
    console.log("   Education date: ⚠️ FABRICATED: " + eduDate);
  } else {
    console.log("   Education date: ✅ Not fabricated (correct!)");
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📈 SUMMARY:");
  console.log("   Original Score: " + originalScore.overallScore + "/100");
  console.log("   Optimized Score: " + optimizedScore.overallScore + "/100");
  console.log("   Improvement: +" + (optimizedScore.overallScore - originalScore.overallScore) + " points");
  console.log("   Issues Remaining: " + allIssues.length);
  console.log("=".repeat(60));

  if (optimizedScore.overallScore >= 95 && allIssues.length <= 1) {
    console.log("\n🎉 KUSURSUZ! Sistem düzgün çalışıyor.");
  } else if (optimizedScore.overallScore >= 90) {
    console.log("\n✅ ÇOK İYİ! Küçük iyileştirmeler yapılabilir.");
  } else {
    console.log("\n⚠️ İYİLEŞTİRME GEREKLİ!");
  }
}

function formatCVAsText(cv: any): string {
  let text = "";

  // Contact
  text += (cv.contact?.name || "") + "\n";
  text += (cv.contact?.email || "") + "\n";
  text += (cv.contact?.phone || "") + "\n";
  text += (cv.contact?.location || "") + "\n";
  if (cv.contact?.linkedin) text += cv.contact.linkedin + "\n";
  text += "\n";

  // Summary
  if (cv.summary) {
    text += "Professional Summary\n";
    text += cv.summary + "\n\n";
  }

  // Experience
  text += "Professional Experience\n";
  cv.experience?.forEach((exp: any) => {
    text += exp.title + " at " + exp.company + "\n";
    text += exp.location + " - " + exp.startDate + " - " + exp.endDate + "\n";
    exp.bullets?.forEach((bullet: string) => {
      text += "• " + bullet + "\n";
    });
    text += "\n";
  });

  // Education
  text += "Education\n";
  cv.education?.forEach((edu: any) => {
    text += edu.degree + ", " + edu.institution;
    if (edu.graduationDate && edu.graduationDate !== null) {
      text += ", " + edu.graduationDate;
    }
    text += "\n";
  });
  text += "\n";

  // Skills
  text += "Skills\n";
  if (cv.skills?.technical) {
    text += "Technical: " + cv.skills.technical.join(", ") + "\n";
  }
  if (cv.skills?.soft) {
    text += "Soft Skills: " + cv.skills.soft.join(", ") + "\n";
  }

  return text;
}

testFullFlow().catch(console.error);
