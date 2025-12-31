/**
 * Test Script: Bullet Transformation Quality
 *
 * Bu script, AI'ın zayıf bullet'ları achievement-based bullet'lara
 * ne kadar iyi dönüştürdüğünü test eder.
 *
 * Çalıştırma: npx tsx scripts/test-bullet-transform.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" }); // Load .env.local file

import OpenAI from "openai";
import { generateATSOptimizationPrompt } from "../src/lib/ai/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zayıf bullet'lı test CV - TARİHSİZ eğitim ve sertifikalar
const weakCV = `
Ahmet Yılmaz
ahmet@email.com
555-123-4567
Istanbul, Turkey

Experience:

Software Developer at ABC Tech
2020 - Present
- Worked on web applications
- Was responsible for database management
- Helped with team projects
- Did code reviews
- Fixed bugs

Junior Developer at XYZ Ltd
2018 - 2020
- Worked in the development team
- Assisted senior developers
- Participated in meetings
- Wrote some code

Education:
Computer Science, Istanbul University

Certifications:
AWS Solutions Architect
Google Cloud Professional

Courses:
React Masterclass - Udemy
Node.js Complete Guide

Skills:
JavaScript, React, Node.js, SQL
`;

// Fake ATS result (simulating what check endpoint would return)
const fakeAtsResult = {
  overallScore: 45,
  categories: {
    format: {
      issues: [{ issue: "No LinkedIn URL", fix: "Add LinkedIn profile" }],
      passes: ["Single column layout"],
    },
    structure: {
      issues: [{ issue: "Missing professional summary", fix: "Add summary" }],
      passes: ["Has experience section"],
    },
    keywords: {
      issues: [{ issue: "Weak action verbs", fix: "Use power verbs" }],
      passes: [],
    },
    readability: {
      issues: [
        { issue: "Bullets lack metrics", fix: "Add quantified achievements" },
        { issue: "Generic descriptions", fix: "Be specific with results" },
      ],
      passes: [],
    },
  },
  topIssues: [
    { issue: "No quantified achievements", suggestion: "Add metrics to every bullet", category: "keywords" },
    { issue: "Weak action verbs", suggestion: "Start with power verbs", category: "keywords" },
    { issue: "Generic bullet points", suggestion: "Be specific about impact", category: "readability" },
  ],
  quickWins: [
    "Add LinkedIn URL",
    "Add professional summary",
    "Add metrics to bullets",
  ],
};

async function testBulletTransformation() {
  console.log("🧪 Testing Bullet Transformation...\n");
  console.log("=" .repeat(60));
  console.log("📥 INPUT CV (Weak Bullets):");
  console.log("=" .repeat(60));
  console.log(weakCV);
  console.log("\n");

  try {
    const prompt = generateATSOptimizationPrompt(weakCV, fakeAtsResult);

    console.log("🤖 Calling AI for optimization...\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    console.log("=" .repeat(60));
    console.log("📤 OUTPUT CV (Optimized Bullets):");
    console.log("=" .repeat(60));

    // Print experience bullets
    console.log("\n🏢 EXPERIENCE BULLETS:\n");

    // Detect seniority for display
    const displaySeniority = result.detectedSeniority?.level || "mid";

    if (result.experience) {
      result.experience.forEach((exp: any, idx: number) => {
        console.log(`\n[${idx + 1}] ${exp.title} at ${exp.company}`);
        console.log(`    ${exp.startDate} - ${exp.endDate}`);
        console.log("    Bullets:");
        exp.bullets?.forEach((bullet: string, bIdx: number) => {
          const hasMetric = /\d+/.test(bullet);

          // Power verbs (always good)
          const hasPowerVerb = /^(Led|Spearheaded|Orchestrated|Architected|Directed|Transformed|Pioneered|Established|Cultivated|Championed|Maximized|Revolutionized|Developed|Implemented|Managed|Executed|Delivered|Created|Built|Generated|Achieved|Drove|Optimized|Streamlined|Launched|Improved|Designed|Expanded|Initiated|Modernized|Negotiated|Scaled|Accelerated|Resolved|Authored|Enabled|Conducted|Facilitated)/i.test(bullet);

          // Context verbs (OK for junior/mid)
          const hasContextVerb = /^(Collaborated|Contributed|Assisted|Supported|Participated|Gained|Acquired)/i.test(bullet);

          // Universal banned (bad for all)
          const hasUniversalBanned = /^(Worked on|Was responsible|Wrote|Did|Made|Handled|Helped)/i.test(bullet);

          const length = bullet.length;

          // Determine status based on seniority
          let status = "❌";
          let verbNote = "";

          if (hasUniversalBanned) {
            status = "🚫";
            verbNote = "BANNED VERB!";
          } else if (hasPowerVerb) {
            status = hasMetric ? "✅" : "⚠️";
            verbNote = "Power verb ✓";
          } else if (hasContextVerb) {
            if (displaySeniority === "junior" || displaySeniority === "mid") {
              status = hasMetric ? "✅" : "⚠️";
              verbNote = `OK for ${displaySeniority}`;
            } else {
              status = "🚫";
              verbNote = "Too weak for senior!";
            }
          } else {
            status = hasMetric ? "⚠️" : "❌";
            verbNote = "No power verb";
          }

          console.log(`    ${status} ${bIdx + 1}. ${bullet}`);
          console.log(`       [Metric: ${hasMetric ? "✓" : "✗"}, ${verbNote}, Length: ${length} chars]`);
        });
      });
    }

    // Summary
    console.log("\n\n📊 SUMMARY:");
    console.log("=" .repeat(60));
    console.log(`Professional Summary: ${result.summary ? "✅ Added" : "❌ Missing"}`);
    console.log(`LinkedIn: ${result.contact?.linkedin ? "✅ " + result.contact.linkedin : "❌ Missing"}`);

    // Seniority Detection
    if (result.detectedSeniority) {
      console.log(`\n🎯 SENIORITY DETECTION:`);
      console.log(`  Level: ${result.detectedSeniority.level?.toUpperCase()}`);
      console.log(`  Strategy: ${result.detectedSeniority.verbStrategy}`);
      console.log(`  Signals: ${result.detectedSeniority.signals?.join(", ")}`);
    }

    let totalBullets = 0;
    let bulletsWithMetrics = 0;
    let bulletsWithActionVerbs = 0;
    let bulletsWithBannedVerbs = 0;

    const seniorityLevel = result.detectedSeniority?.level || "mid";

    // Power verbs (always good)
    const powerVerbRegex = /^(Led|Spearheaded|Orchestrated|Architected|Directed|Transformed|Pioneered|Established|Cultivated|Championed|Maximized|Revolutionized|Developed|Implemented|Managed|Executed|Delivered|Created|Built|Generated|Achieved|Drove|Optimized|Streamlined|Launched|Improved|Designed|Expanded|Initiated|Modernized|Negotiated|Scaled|Accelerated|Resolved|Authored|Enabled|Conducted|Facilitated)/i;

    // Context verbs (OK for junior/mid, not for senior)
    const contextVerbRegex = /^(Collaborated|Contributed|Assisted|Supported|Participated|Gained|Acquired)/i;

    // Universal banned verbs (bad for everyone)
    const universalBannedRegex = /^(Worked on|Was responsible|Wrote|Did|Made|Handled|Helped)/i;

    result.experience?.forEach((exp: any) => {
      exp.bullets?.forEach((bullet: string) => {
        totalBullets++;
        if (/\d+/.test(bullet)) bulletsWithMetrics++;

        if (powerVerbRegex.test(bullet)) {
          bulletsWithActionVerbs++;
        } else if (contextVerbRegex.test(bullet)) {
          // Context verbs are OK for junior/mid
          if (seniorityLevel === "junior" || seniorityLevel === "mid") {
            bulletsWithActionVerbs++;
          } else {
            bulletsWithBannedVerbs++;
          }
        } else if (universalBannedRegex.test(bullet)) {
          bulletsWithBannedVerbs++;
        }
      });
    });

    console.log(`\nBullet Quality (Seniority: ${seniorityLevel}):`);
    console.log(`  Total Bullets: ${totalBullets}`);
    console.log(`  With Metrics: ${bulletsWithMetrics}/${totalBullets} (${Math.round(bulletsWithMetrics/totalBullets*100)}%)`);
    console.log(`  With Power/Appropriate Verbs: ${bulletsWithActionVerbs}/${totalBullets} (${Math.round(bulletsWithActionVerbs/totalBullets*100)}%)`);
    console.log(`  With Inappropriate Verbs: ${bulletsWithBannedVerbs}/${totalBullets} (${bulletsWithBannedVerbs > 0 ? "❌" : "✅"})`);

    // Education - check for fabricated dates
    console.log(`\n🎓 EDUCATION (Checking for fabricated dates):`);
    result.education?.forEach((edu: any, idx: number) => {
      const hasDate = edu.graduationDate && edu.graduationDate !== null;
      const dateStatus = hasDate ? `⚠️ DATE: ${edu.graduationDate}` : "✅ No fabricated date";
      console.log(`  ${idx + 1}. ${edu.degree} - ${edu.institution}`);
      console.log(`     ${dateStatus}`);
    });

    // Certifications - check for fabricated dates
    console.log(`\n📜 CERTIFICATIONS (Checking for fabricated dates):`);
    result.certifications?.forEach((cert: any, idx: number) => {
      const hasDate = cert.date && cert.date !== null;
      const dateStatus = hasDate ? `⚠️ DATE: ${cert.date}` : "✅ No fabricated date";
      console.log(`  ${idx + 1}. ${cert.name} - ${cert.issuer || "N/A"}`);
      console.log(`     ${dateStatus}`);
    });

    // Changes tracked
    console.log(`\n📝 Changes Made: ${result.changes?.length || 0}`);
    result.changes?.slice(0, 5).forEach((change: any) => {
      console.log(`  - [${change.category}] ${change.fix}`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testBulletTransformation();
