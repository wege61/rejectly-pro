/**
 * AI Prompts - Main Export File
 *
 * This file re-exports all prompt functions from the modular prompts directory.
 * Individual prompts are organized into separate files for better maintainability.
 *
 * Structure:
 * - prompts/freeSummary.ts     - Quick CV analysis for free users
 * - prompts/proReport.ts       - Detailed analysis for premium users
 * - prompts/cvOptimization.ts  - Generate optimized CVs
 * - prompts/fakeSkills.ts      - Learning path recommendations
 * - prompts/coverLetter.ts     - Personalized cover letters
 * - prompts/scoring.ts         - Systematic match scoring
 * - prompts/atsCheck.ts        - ATS compatibility analysis
 */

// Re-export all prompts from the modular structure
export * from "./prompts/index";
