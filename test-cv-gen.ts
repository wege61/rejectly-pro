import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTests() {
  console.log("Starting CV Generation Tests...\n");

  const mockCVText = `
NAME: Angelina Junior
EMAIL: angie@example.com
EXPERIENCE:
Cashier - Local Supermarket
Jan 2023 - Present
- Handled transactions and customer service
- Organized shelves

EDUCATION:
Bachelor of Fine Arts in Graphic Design
University of Arts
Graduated May 2024
  `;

  const mockJobText = `
Job Title: Junior Graphic Designer
Requirements:
- 0-2 years of experience
- Proficiency in Adobe Illustrator and Figma
- Strong visual design skills
  `;

  const analysisResults = {
    fitScore: 75,
    summary: "Good match",
    missingKeywords: ["Figma"],
    rewrittenBullets: [],
    roleRecommendations: [],
    atsFlags: []
  };

  const academicDetails = {
    capstone: "Tourism Brand Design: Created full visual identity for a fictitious tourism board including logo, typography, and marketing materials.",
    gpa: "",
    coursework: ""
  };

  const { generateOptimizedCVPrompt } = await import('./src/lib/ai/prompts/cvOptimization');
  const { openai, AI_MODEL } = await import('./src/lib/ai/client');

  const prompt = generateOptimizedCVPrompt(
    mockCVText,
    [mockJobText],
    analysisResults,
    [], // additionalTools
    [], // extractedMetrics
    '', // achievementsSection
    "English", // outputLanguage
    {}, // userProvidedMetrics
    academicDetails // academicDetails
  );

  console.log("Sending prompt to OpenAI...");
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an elite ATS resume optimizer. Respond ONLY in valid JSON format matching the requested schema."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) throw new Error("No response from AI");
    
    const cvJson = JSON.parse(resultText);

    let passed = true;

    // T7: Assert capstone data results in a projects array
    if (!cvJson.projects || cvJson.projects.length === 0) {
      console.error("❌ T7 FAILED: 'projects' array is missing or empty despite providing capstone data.");
      passed = false;
    } else {
      const proj = cvJson.projects[0];
      if (proj.name.includes("Tourism Brand Design") || proj.bullets.some((b:string) => b.includes("Tourism"))) {
        console.log("✅ T7 PASSED: Capstone project found in 'projects' array.");
      } else {
        console.error("❌ T7 FAILED: Capstone project data not found in 'projects' array:", proj);
        passed = false;
      }
    }

    // T8: Assert summary lacks "years of experience" for zero-experience profiles
    const summary = cvJson.summary.toLowerCase();
    if (summary.match(/\d+\s+years?\s+of\s+experience/)) {
      console.error("❌ T8 FAILED: Summary contains fabricated 'years of experience' for a new grad:", summary);
      passed = false;
    } else {
      console.log("✅ T8 PASSED: Summary does not claim false years of experience.");
    }

    // T9: Assert unrelated retail jobs do not contain injected target-field keywords
    const cashierJob = cvJson.experience.find((e: any) => e.title.toLowerCase().includes("cashier"));
    if (cashierJob) {
      const injectedKeywords = cashierJob.bullets.some((b: string) => 
        b.toLowerCase().includes("design") || 
        b.toLowerCase().includes("graphic") ||
        b.toLowerCase().includes("illustrator") ||
        b.toLowerCase().includes("figma")
      );
      if (injectedKeywords) {
        console.error("❌ T9 FAILED: Retail job (Cashier) contains injected graphic design keywords:", cashierJob.bullets);
        passed = false;
      } else {
        console.log("✅ T9 PASSED: Retail job remains honest without injected design keywords.");
      }
    } else {
      console.error("❌ T9 FAILED: Cashier job was removed entirely, violating factual preservation rule.");
      passed = false;
    }

    // T10: Assert factual content is unchanged
    if (!cashierJob) {
       console.error("❌ T10 FAILED: Job experience was removed.");
       passed = false;
    } else if (cashierJob.company !== "Local Supermarket") {
       console.error(`❌ T10 FAILED: Company name altered. Expected "Local Supermarket", got "${cashierJob.company}"`);
       passed = false;
    } else {
       console.log("✅ T10 PASSED: Factual job titles and employers preserved.");
    }

    // T11: Assert GPA and coursework are not hallucinated
    const edu = cvJson.education[0];
    if (edu && edu.details) {
      const details = typeof edu.details === 'string' ? edu.details.toLowerCase() : JSON.stringify(edu.details).toLowerCase();
      if (details.includes("gpa") || details.includes("3.8") || details.includes("4.0") || details.includes("coursework") || details.includes("курсы")) {
        console.error("❌ T11 FAILED: Hallucinated GPA or coursework in education details:", edu.details);
        passed = false;
      } else {
        console.log("✅ T11 PASSED: No hallucinated GPA or coursework, but a details field was generated:", edu.details);
      }
    } else {
      console.log("✅ T11 PASSED: No details field generated, which is correct.");
    }

    if (passed) {
      console.log("\n🎉 ALL TESTS PASSED!");
    } else {
      console.log("\n⚠️ SOME TESTS FAILED.");
      console.log(JSON.stringify(cvJson, null, 2));
    }

  } catch (e) {
    console.error("Test execution failed:", e);
  }
}

runTests();
