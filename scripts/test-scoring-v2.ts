
import { normalizeScoreBreakdown, ScoreBreakdown } from "../src/types/scoreBreakdown";

const v2MockResponse: any = {
  version: "2.0",
  calculatedAt: new Date().toISOString(),
  jobAnalysis: {
    detectedLevel: "senior",
    requiredYears: 5,
    industry: "FinTech",
    requiredSkillsCount: 5,
    preferredSkillsCount: 3,
    hasCertRequirement: false,
    hasEducationRequirement: true
  },
  candidateAnalysis: {
    detectedLevel: "mid",
    relevantYears: 3,
    totalYears: 6,
    industry: "E-commerce",
    hasRequiredEducation: true,
    hasRequiredCerts: false
  },
  components: {
    hardSkills: {
      name: "Hard Skills Match",
      maxPoints: 35,
      earnedPoints: 20,
      percentage: 57,
      details: {
        requiredSkillsTotal: 5,
        requiredSkillsMatched: 3,
        preferredSkillsTotal: 3,
        preferredSkillsMatched: 1
      },
      matchedSkills: [
        { skill: "Python", evidence: "Used in 3 jobs", credit: 1.0 },
        { skill: "React", evidence: "Listed in skills", credit: 0.5 }
      ],
      missingSkills: [
        { skill: "Docker", required: true },
        { skill: "AWS", required: true }
      ]
    },
    experienceLevel: {
      name: "Experience Level",
      maxPoints: 25,
      earnedPoints: 15,
      percentage: 60,
      details: "Experience details"
    },
    industryDomain: {
      name: "Industry & Domain",
      maxPoints: 20,
      earnedPoints: 10,
      percentage: 50,
      details: "Industry details"
    },
    roleSpecific: {
      name: "Role Specific",
      maxPoints: 10,
      earnedPoints: 10,
      percentage: 100,
      requirementsMet: ["English C1"],
      requirementsNotMet: []
    }
  },
  penalties: [],
  calculation: {
    rawScore: 55,
    totalPenalties: 0,
    finalScore: 55
  },
  assessment: {
    verdict: "lean_interview",
    percentile: "average",
    recommendation: "Consider if no better candidates.",
    topStrengths: ["Communication"],
    criticalGaps: ["Seniority"]
  },
  displayData: {
    scoreColor: "#f59e0b",
    scoreLabel: "Moderate Only",
    primaryGap: "Experience"
  },
  summary: "A moderate match."
};

console.log("---------------------------------------------------");
console.log("TESTING NORMALIZE SCORING V2");
console.log("---------------------------------------------------");

const normalized = normalizeScoreBreakdown(v2MockResponse);

console.log("Final Score:", normalized.finalScore);
console.log("Job Level (should be senior):", normalized.jobLevel);

console.log("\nCOMPONENT: Skills Match (mapped from hardSkills)");
const skills = normalized.components.skillsMatch;
console.log("- Exists:", !!skills);
console.log("- Matched Items:", skills?.matchedItems);
console.log("- Missing Items:", skills?.missingItems);

console.log("\nCOMPONENT: Role Specific (should map to matchedItems)");
const role = normalized.components.roleSpecific; // Note: In my fix I didn't map roleSpecific to a V1 component, just normalized its arrays
console.log("- Matched Items:", role?.matchedItems);

if (skills?.matchedItems?.length === 2 && skills?.matchedItems[0].includes("Python")) {
    console.log("\n✅ SUCCESS: matchedSkills mapped to matchedItems correctly.");
} else {
    console.log("\n❌ ALLOCATION FAILED: matchedItems not populated correctly.");
     console.log("Got:", skills?.matchedItems);
}
