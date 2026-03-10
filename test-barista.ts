import { generateSystematicScoringPrompt } from './src/lib/ai/prompts/scoring';
import { openai, AI_MODEL } from './src/lib/ai/client';
import { normalizeScoreBreakdown } from './src/types/scoreBreakdown';

const candidateCV = `
SKILLS
Espresso Machine Operation, Customer Service, Cleaning, POS Systems

WORK EXPERIENCE
Barista, Starbucks
Jan 2022 - Present
- Prepared customized coffee drinks according to company standards.
- Maintained a clean and organized workspace.
- Handled cash and card transactions.

SUMMARY
Enthusiastic Barista looking for a new challenge in an office environment.
`;

const targetJob = `
Company Description
Teleperformance, a global leader in providing exceptional customer experiences, offers services to companies on an international scale, achieving superior results in managing customer service, technical support, sales, marketing, and collection processes.

The Teleperformance Group operates in 100 countries, with 300+ languages and dialects, and employs over 500,000 professionals, serving large-scale international firms in 170+ sectors with outsourced customer experience services.

Teleperformance Turkey collaborates with large-scale companies across 150+ sectors, employing over 11,000 professionals.

We are looking for an “English Speaking Customer Expert” to be assigned to our Teleperformance Turkey Istanbul/Flatofis Campus.

Job Description
Answering calls coming to our customer experience center in accordance with standards,
Seeking customer service specialists who will ensure customer satisfaction by providing accurate information and quality service.

Qualifications
Excellent written and spoken English proficiency,
At least a high school diploma, preferably an associate or bachelor’s degree,
Preferably with experience in a Customer Experience Center,
Good diction and strong communication skills,
Active computer usage,
Customer satisfaction-oriented,
Team player,
Open to working in a shift system.

Teleperformance, as a global leader in digital business services, adopts the approach of “Our strength is technology, Our focus is people,” providing simpler, faster, and more secure customer services to the world’s leading brands. Being recognized as one of the top 5 workplaces globally, Teleperformance offers career opportunities for individuals seeking to join our team. We are looking for team members to join us at Teleperformance, an award-winning Great Place to Work, where we will achieve new successes together.
`;

async function main() {
  console.log('============ TESTING STRICT EXPERIENCE SCORING ============');
  const scoringPrompt = generateSystematicScoringPrompt(candidateCV, [targetJob]);
  const scoringRes = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: 'user', content: scoringPrompt }],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  });
  
  const rawData = JSON.parse(scoringRes.choices[0].message.content || "{}");
  const scoringData = normalizeScoreBreakdown(rawData);
  
  console.log('Experience Details:', scoringData.components?.experienceLevel?.details);
  console.log('Experience Earned Points:', scoringData.components?.experienceLevel?.earnedPoints);
  console.log('Final Score:', scoringData.calculation?.finalScore || scoringData.finalScore);
}

main().catch(console.error);
