/**
 * AI Prompts Index
 * Central export point for all prompt generation functions
 */

// Free Summary - Quick CV analysis for free users
export { generateFreeSummaryPrompt } from './freeSummary';

// Pro Report - Detailed analysis for premium users
export {
  generateProReportPrompt,
  generateImprovementBreakdownPrompt
} from './proReport';

// CV Optimization - Generate optimized CVs
export {
  generateOptimizedCVPrompt,
  generateOptimizedCVAnalysisPrompt
} from './cvOptimization';

// Fake Skills - Learning path recommendations
export { generateFakeSkillsRecommendationsPrompt } from './fakeSkills';

// Cover Letter - Generate personalized cover letters
export { generateCoverLetterPrompt } from './coverLetter';

// Scoring - Systematic match scoring
export { generateSystematicScoringPrompt } from './scoring';

// ATS Check - ATS compatibility analysis and optimization
export {
  generateATSCheckPrompt,
  generateOptimizedCVValidationPrompt,
  generateATSOptimizationPrompt
} from './atsCheck';
