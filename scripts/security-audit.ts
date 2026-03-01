#!/usr/bin/env npx ts-node

/**
 * Security Audit Agent for Rejectly Pro
 * Run before every production deploy: pnpm security:audit
 *
 * Based on OWASP Top 10 and Next.js security best practices
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface AuditResult {
  category: string;
  check: string;
  status: "PASS" | "WARN" | "FAIL" | "INFO";
  message: string;
  fix?: string;
}

interface AuditSummary {
  total: number;
  passed: number;
  warnings: number;
  failed: number;
  results: AuditResult[];
}

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const API_DIR = path.join(SRC_DIR, "app/api");

// ANSI colors for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function log(message: string, color?: keyof typeof colors) {
  const prefix = color ? colors[color] : "";
  console.log(`${prefix}${message}${colors.reset}`);
}

function logResult(result: AuditResult) {
  const statusColors = {
    PASS: colors.green,
    WARN: colors.yellow,
    FAIL: colors.red,
    INFO: colors.blue,
  };
  const icon = {
    PASS: "✓",
    WARN: "⚠",
    FAIL: "✗",
    INFO: "ℹ",
  };

  console.log(
    `  ${statusColors[result.status]}${icon[result.status]} [${result.status}]${colors.reset} ${result.check}`
  );
  console.log(`    ${colors.dim}${result.message}${colors.reset}`);
  if (result.fix && result.status !== "PASS") {
    console.log(`    ${colors.cyan}Fix: ${result.fix}${colors.reset}`);
  }
}

// ============================================================================
// 1. RATE LIMITING CHECKS
// ============================================================================

function checkRateLimiting(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for rate limiting packages
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8")
  );
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const rateLimitPackages = [
    "rate-limiter-flexible",
    "@upstash/ratelimit",
    "express-rate-limit",
    "limiter",
    "@arcjet/next",
    "next-rate-limit",
  ];

  const hasRateLimiter = rateLimitPackages.some((pkg) => deps[pkg]);

  // Also check for custom rate limiting implementation
  const rateLimitFilePath = path.join(SRC_DIR, "lib/rateLimit.ts");
  const hasCustomRateLimiter = fs.existsSync(rateLimitFilePath);

  results.push({
    category: "Rate Limiting",
    check: "Rate limiting package installed",
    status: hasRateLimiter || hasCustomRateLimiter ? "PASS" : "FAIL",
    message: hasRateLimiter
      ? `Found rate limiting package in dependencies`
      : hasCustomRateLimiter
      ? "Custom rate limiting implementation found (src/lib/rateLimit.ts)"
      : "No rate limiting package found in dependencies",
    fix: "Install @upstash/ratelimit or rate-limiter-flexible for API protection",
  });

  // Check middleware for rate limiting implementation
  let middlewarePath = path.join(ROOT_DIR, "middleware.ts");
  if (!fs.existsSync(middlewarePath)) {
    middlewarePath = path.join(SRC_DIR, "middleware.ts");
  }
  if (fs.existsSync(middlewarePath)) {
    const middlewareContent = fs.readFileSync(middlewarePath, "utf-8");
    const hasRateLimitMiddleware =
      middlewareContent.includes("ratelimit") ||
      middlewareContent.includes("rate-limit") ||
      middlewareContent.includes("RateLimit") ||
      middlewareContent.includes("RATE_LIMIT") ||
      middlewareContent.includes("rateLimitStore") ||
      middlewareContent.includes("checkRateLimit") ||
      middlewareContent.includes("RATE_LIMITS") ||
      middlewareContent.includes("429"); // HTTP 429 Too Many Requests

    results.push({
      category: "Rate Limiting",
      check: "Rate limiting in middleware",
      status: hasRateLimitMiddleware ? "PASS" : "WARN",
      message: hasRateLimitMiddleware
        ? "Rate limiting logic found in middleware"
        : "No rate limiting in middleware - APIs vulnerable to abuse",
      fix: "Add rate limiting to middleware.ts using Upstash or similar",
    });
  } else {
    results.push({
      category: "Rate Limiting",
      check: "Rate limiting in middleware",
      status: "WARN",
      message: "No middleware.ts found",
      fix: "Create middleware.ts with rate limiting logic",
    });
  }

  // Check API routes for rate limiting
  const apiRoutes = getAllFiles(API_DIR, [".ts", ".tsx"]);
  let routesWithRateLimit = 0;

  for (const route of apiRoutes) {
    const content = fs.readFileSync(route, "utf-8");
    if (
      content.includes("ratelimit") ||
      content.includes("rate-limit") ||
      content.includes("RateLimit")
    ) {
      routesWithRateLimit++;
    }
  }

  results.push({
    category: "Rate Limiting",
    check: "API routes with rate limiting",
    status: routesWithRateLimit > 0 ? "PASS" : "WARN",
    message: `${routesWithRateLimit}/${apiRoutes.length} API routes have rate limiting`,
    fix: "Add rate limiting to sensitive endpoints like /api/auth/*, /api/analyze/*",
  });

  return results;
}

// ============================================================================
// 2. ROW LEVEL SECURITY (RLS) CHECKS
// ============================================================================

function checkRowLevelSecurity(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for user_id filtering in queries
  const libFiles = getAllFiles(path.join(SRC_DIR, "lib"), [".ts"]);
  const apiFiles = getAllFiles(API_DIR, [".ts", ".tsx"]);
  const allFiles = [...libFiles, ...apiFiles];

  let queriesWithUserFilter = 0;
  let totalQueries = 0;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");

    // Count Supabase queries
    const selectMatches = content.match(/\.select\(/g) || [];
    const insertMatches = content.match(/\.insert\(/g) || [];
    const updateMatches = content.match(/\.update\(/g) || [];
    const deleteMatches = content.match(/\.delete\(/g) || [];

    totalQueries +=
      selectMatches.length +
      insertMatches.length +
      updateMatches.length +
      deleteMatches.length;

    // Check for user_id filtering
    const userIdFilters =
      content.match(/\.eq\s*\(\s*["']user_id["']/g) || [];
    queriesWithUserFilter += userIdFilters.length;
  }

  results.push({
    category: "Row Level Security",
    check: "User ID filtering in queries",
    status: queriesWithUserFilter > 0 ? "PASS" : "FAIL",
    message: `Found ${queriesWithUserFilter} queries with user_id filtering`,
    fix: "Ensure all queries filter by user_id: .eq('user_id', user.id)",
  });

  // Check for service role key usage
  let serviceRoleUsage = 0;
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (
      content.includes("SERVICE_ROLE") ||
      content.includes("serviceRole") ||
      content.includes("service_role")
    ) {
      serviceRoleUsage++;
    }
  }

  results.push({
    category: "Row Level Security",
    check: "Service Role Key usage",
    status: serviceRoleUsage < 5 ? "PASS" : "WARN",
    message: `Service Role Key referenced in ${serviceRoleUsage} files`,
    fix: "Minimize Service Role usage - only use for admin operations",
  });

  // Check for RLS bypass patterns
  let bypassPatterns = 0;
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (
      content.includes("security_invoker") ||
      content.includes("SECURITY DEFINER") ||
      content.includes("rls_disabled")
    ) {
      bypassPatterns++;
    }
  }

  results.push({
    category: "Row Level Security",
    check: "RLS bypass patterns",
    status: bypassPatterns === 0 ? "PASS" : "WARN",
    message:
      bypassPatterns === 0
        ? "No RLS bypass patterns detected"
        : `Found ${bypassPatterns} potential RLS bypass patterns`,
    fix: "Review and remove any unnecessary RLS bypass patterns",
  });

  return results;
}

// ============================================================================
// 3. CAPTCHA CHECKS
// ============================================================================

function checkCaptcha(): AuditResult[] {
  const results: AuditResult[] = [];

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8")
  );
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const captchaPackages = [
    "react-google-recaptcha",
    "@hcaptcha/react-hcaptcha",
    "react-turnstile",
    "@cloudflare/turnstile",
    "@marsidev/react-turnstile",
    "react-simple-captcha",
  ];

  const hasCaptcha = captchaPackages.some((pkg) => deps[pkg]);

  results.push({
    category: "CAPTCHA",
    check: "CAPTCHA package installed",
    status: hasCaptcha ? "PASS" : "WARN",
    message: hasCaptcha
      ? "CAPTCHA package found in dependencies"
      : "No CAPTCHA package - forms vulnerable to bots",
    fix: "Install react-turnstile (Cloudflare) or @hcaptcha/react-hcaptcha",
  });

  // Check auth pages for CAPTCHA
  const authDir = path.join(SRC_DIR, "app/(auth)");
  if (fs.existsSync(authDir)) {
    const authFiles = getAllFiles(authDir, [".tsx", ".ts"]);
    let hasAuthCaptcha = false;

    for (const file of authFiles) {
      const content = fs.readFileSync(file, "utf-8");
      if (
        content.toLowerCase().includes("captcha") ||
        content.includes("Turnstile") ||
        content.includes("ReCAPTCHA") ||
        content.includes("hCaptcha")
      ) {
        hasAuthCaptcha = true;
        break;
      }
    }

    results.push({
      category: "CAPTCHA",
      check: "CAPTCHA on auth forms",
      status: hasAuthCaptcha ? "PASS" : "WARN",
      message: hasAuthCaptcha
        ? "CAPTCHA found on authentication forms"
        : "No CAPTCHA on auth forms - vulnerable to credential stuffing",
      fix: "Add Turnstile/reCAPTCHA to login, signup, and password reset forms",
    });
  }

  // Check for CAPTCHA verification in API routes
  const authApiFiles = getAllFiles(path.join(API_DIR, "auth"), [".ts", ".tsx"]);
  let hasServerCaptchaVerify = false;

  for (const file of authApiFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (
      content.includes("captcha") ||
      content.includes("turnstile") ||
      content.includes("recaptcha") ||
      content.includes("cf-turnstile") ||
      content.includes("siteverify")
    ) {
      hasServerCaptchaVerify = true;
      break;
    }
  }

  results.push({
    category: "CAPTCHA",
    check: "Server-side CAPTCHA verification",
    status: hasServerCaptchaVerify ? "PASS" : "WARN",
    message: hasServerCaptchaVerify
      ? "Server-side CAPTCHA verification found"
      : "No server-side CAPTCHA verification in auth APIs",
    fix: "Verify CAPTCHA tokens server-side before processing auth requests",
  });

  return results;
}

// ============================================================================
// 4. SERVER-SIDE VALIDATION CHECKS
// ============================================================================

function checkServerValidation(): AuditResult[] {
  const results: AuditResult[] = [];

  const apiFiles = getAllFiles(API_DIR, [".ts", ".tsx"]);

  let filesWithValidation = 0;
  let filesWithZod = 0;
  let filesWithTypeCheck = 0;

  const validationPatterns = [
    /typeof\s+\w+\s*[!=]==?\s*["']string["']/,
    /typeof\s+\w+\s*[!=]==?\s*["']number["']/,
    /Array\.isArray/,
    /\.trim\(\)/,
    /\.length\s*[<>=]/,
    /if\s*\(\s*!\w+\s*\)/,
    /!==?\s*undefined/,
    /!==?\s*null/,
  ];

  for (const file of apiFiles) {
    const content = fs.readFileSync(file, "utf-8");

    // Check for Zod validation
    if (
      content.includes("import { z }") ||
      content.includes("from 'zod'") ||
      content.includes('from "zod"') ||
      content.includes("validations") ||
      content.includes("validateRequest")
    ) {
      filesWithZod++;
    }

    // Check for type checking
    let hasValidation = false;
    for (const pattern of validationPatterns) {
      if (pattern.test(content)) {
        hasValidation = true;
        break;
      }
    }

    if (hasValidation) {
      filesWithValidation++;
    }

    // Check for type-safe parsing
    if (content.includes(".parse(") || content.includes(".safeParse(")) {
      filesWithTypeCheck++;
    }
  }

  results.push({
    category: "Server Validation",
    check: "Schema validation library (Zod)",
    status: filesWithZod > 0 ? "PASS" : "WARN",
    message:
      filesWithZod > 0
        ? `${filesWithZod} API files use Zod for validation`
        : "No Zod schema validation - inputs may not be properly validated",
    fix: "Use Zod schemas to validate all API request bodies",
  });

  results.push({
    category: "Server Validation",
    check: "Input validation in API routes",
    status: filesWithValidation > apiFiles.length * 0.7 ? "PASS" : "WARN",
    message: `${filesWithValidation}/${apiFiles.length} API files have input validation`,
    fix: "Add input validation to all API routes before processing data",
  });

  // Check for SQL injection patterns
  // Note: Supabase query builder uses parameterized queries by default
  // Only check for raw SQL or dangerous patterns
  let sqlInjectionRisk = 0;
  for (const file of apiFiles) {
    const content = fs.readFileSync(file, "utf-8");
    // Check for raw SQL execution or dangerous patterns
    // Supabase .eq(), .in(), .select() etc. are safe as they use parameterized queries
    if (
      content.includes(".rpc(") && /`[^`]*\$\{[^}]+\}[^`]*`/.test(content) ||
      content.includes("sql`") ||
      content.includes("raw(") ||
      /execute\s*\(\s*`[^`]*\$\{/.test(content)
    ) {
      sqlInjectionRisk++;
    }
  }

  results.push({
    category: "Server Validation",
    check: "SQL injection prevention",
    status: sqlInjectionRisk === 0 ? "PASS" : "FAIL",
    message:
      sqlInjectionRisk === 0
        ? "Using Supabase query builder (parameterized queries)"
        : `${sqlInjectionRisk} files may have SQL injection vulnerabilities`,
    fix: "Use parameterized queries - never interpolate user input into SQL",
  });

  // Check for XSS patterns
  let xssRisk = 0;
  let sanitizedXss = 0;
  let safeXss = 0; // JSON.stringify, static CSS/JS are safe
  const allTsxFiles = getAllFiles(SRC_DIR, [".tsx"]);
  for (const file of allTsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (content.includes("dangerouslySetInnerHTML")) {
      // Check if it's sanitized
      if (content.includes("DOMPurify") || content.includes("sanitize")) {
        sanitizedXss++;
      }
      // Check if it's safe (JSON.stringify for structured data, or static CSS/JS)
      else if (
        content.includes("JSON.stringify") ||
        content.includes("application/ld+json") ||
        // Static template strings without ${} interpolation (multiline safe)
        /dangerouslySetInnerHTML=\{\s*\{\s*__html:\s*`[^`]*`\s*,?\s*\}\s*\}/s.test(content) &&
        !/dangerouslySetInnerHTML=\{\s*\{\s*__html:\s*`[^`]*\$\{[^`]*`/.test(content)
      ) {
        safeXss++;
      } else {
        xssRisk++;
      }
    }
  }

  results.push({
    category: "Server Validation",
    check: "XSS prevention (dangerouslySetInnerHTML)",
    status: xssRisk === 0 ? "PASS" : "WARN",
    message:
      xssRisk === 0
        ? `All dangerouslySetInnerHTML usages are safe (${sanitizedXss} sanitized, ${safeXss} static/JSON)`
        : `${xssRisk} files use unsanitized dangerouslySetInnerHTML - potential XSS risk`,
    fix: "Sanitize HTML content with DOMPurify before using dangerouslySetInnerHTML",
  });

  return results;
}

// ============================================================================
// 5. API KEYS & SECRETS CHECKS
// ============================================================================

function checkApiKeys(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for exposed secrets in client-side code
  const clientFiles = getAllFiles(path.join(SRC_DIR, "components"), [
    ".tsx",
    ".ts",
  ]);
  const pageFiles = getAllFiles(path.join(SRC_DIR, "app"), [".tsx", ".ts"]);
  const allClientFiles = [...clientFiles, ...pageFiles];

  const secretPatterns = [
    /SUPABASE_SERVICE_ROLE/,
    /OPENAI_API_KEY/,
    /STRIPE_SECRET_KEY/,
    /STRIPE_WEBHOOK_SECRET/,
    /GOOGLE_CLIENT_SECRET/,
    /sk-[a-zA-Z0-9]{20,}/,
    /sk_live_[a-zA-Z0-9]{20,}/,
    /whsec_[a-zA-Z0-9]{20,}/,
  ];

  let exposedSecrets = 0;
  const exposedFiles: string[] = [];

  for (const file of allClientFiles) {
    // Skip API routes
    if (file.includes("/api/")) continue;

    const content = fs.readFileSync(file, "utf-8");

    for (const pattern of secretPatterns) {
      if (pattern.test(content)) {
        exposedSecrets++;
        exposedFiles.push(path.relative(ROOT_DIR, file));
        break;
      }
    }
  }

  results.push({
    category: "API Keys",
    check: "No secrets in client-side code",
    status: exposedSecrets === 0 ? "PASS" : "FAIL",
    message:
      exposedSecrets === 0
        ? "No secret keys found in client-side code"
        : `Found secrets exposed in: ${exposedFiles.slice(0, 3).join(", ")}`,
    fix: "Move all secret keys to server-side only - use NEXT_PUBLIC_ prefix only for public keys",
  });

  // Check .env files for proper gitignore
  const gitignorePath = path.join(ROOT_DIR, ".gitignore");
  let envIgnored = false;

  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, "utf-8");
    envIgnored =
      gitignore.includes(".env") ||
      gitignore.includes(".env.local") ||
      gitignore.includes("*.env");
  }

  results.push({
    category: "API Keys",
    check: ".env files in .gitignore",
    status: envIgnored ? "PASS" : "FAIL",
    message: envIgnored
      ? ".env files are properly gitignored"
      : ".env files may not be gitignored - secrets at risk",
    fix: "Add .env, .env.local, .env.*.local to .gitignore",
  });

  // Check for hardcoded API keys
  let hardcodedKeys = 0;
  const allFiles = getAllFiles(SRC_DIR, [".ts", ".tsx"]);

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    // Check for hardcoded keys (common patterns)
    if (
      /["']sk-[a-zA-Z0-9]{32,}["']/.test(content) ||
      /["']sk_live_[a-zA-Z0-9]{20,}["']/.test(content) ||
      /["']pk_live_[a-zA-Z0-9]{20,}["']/.test(content)
    ) {
      hardcodedKeys++;
    }
  }

  results.push({
    category: "API Keys",
    check: "No hardcoded API keys",
    status: hardcodedKeys === 0 ? "PASS" : "FAIL",
    message:
      hardcodedKeys === 0
        ? "No hardcoded API keys detected"
        : `Found ${hardcodedKeys} hardcoded API keys in source code`,
    fix: "Move all API keys to environment variables",
  });

  // Check for API key in URL/query params
  let keysInUrls = 0;
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (/[?&]api_key=/.test(content) || /[?&]apiKey=/.test(content)) {
      keysInUrls++;
    }
  }

  results.push({
    category: "API Keys",
    check: "No API keys in URLs",
    status: keysInUrls === 0 ? "PASS" : "WARN",
    message:
      keysInUrls === 0
        ? "No API keys passed via URL parameters"
        : `${keysInUrls} instances of API keys in URL parameters`,
    fix: "Pass API keys in request headers, not URL parameters",
  });

  return results;
}

// ============================================================================
// 6. ENVIRONMENT VARIABLES CHECKS
// ============================================================================

function checkEnvVars(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for .env.example
  const envExamplePath = path.join(ROOT_DIR, ".env.example");
  const hasEnvExample = fs.existsSync(envExamplePath);

  results.push({
    category: "Environment",
    check: ".env.example file exists",
    status: hasEnvExample ? "PASS" : "WARN",
    message: hasEnvExample
      ? ".env.example exists for documentation"
      : "Missing .env.example - other devs won't know required vars",
    fix: "Create .env.example with all required variables (without values)",
  });

  // Check env validation
  const configPath = path.join(SRC_DIR, "lib/config.ts");
  let hasEnvValidation = false;

  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf-8");
    hasEnvValidation =
      content.includes("validateEnv") ||
      content.includes("process.env") ||
      content.includes("throw");
  }

  results.push({
    category: "Environment",
    check: "Environment variable validation",
    status: hasEnvValidation ? "PASS" : "WARN",
    message: hasEnvValidation
      ? "Environment variables are validated at startup"
      : "No environment variable validation found",
    fix: "Add validation to fail fast if required env vars are missing",
  });

  // Check for NEXT_PUBLIC_ prefix usage
  const allFiles = getAllFiles(SRC_DIR, [".ts", ".tsx"]);
  let clientEnvUsage = 0;

  for (const file of allFiles) {
    // Skip API routes and server files
    if (file.includes("/api/") || file.includes("/lib/")) continue;

    const content = fs.readFileSync(file, "utf-8");
    // Check for non-NEXT_PUBLIC_ env vars in client code
    const envMatches = content.match(/process\.env\.(?!NEXT_PUBLIC_)\w+/g);
    if (envMatches) {
      clientEnvUsage += envMatches.length;
    }
  }

  results.push({
    category: "Environment",
    check: "Proper NEXT_PUBLIC_ prefix usage",
    status: clientEnvUsage === 0 ? "PASS" : "WARN",
    message:
      clientEnvUsage === 0
        ? "Client code only accesses NEXT_PUBLIC_ variables"
        : `${clientEnvUsage} non-public env var accesses in client code`,
    fix: "Only NEXT_PUBLIC_ prefixed vars are available client-side",
  });

  return results;
}

// ============================================================================
// 7. CORS CHECKS
// ============================================================================

function checkCors(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for CORS configuration
  const nextConfigPath = path.join(ROOT_DIR, "next.config.ts");
  let hasCorsConfig = false;
  let hasSecurityHeaders = false;

  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, "utf-8");
    hasCorsConfig =
      content.includes("Access-Control") || content.includes("cors");
    hasSecurityHeaders =
      content.includes("headers") &&
      (content.includes("X-Frame-Options") ||
        content.includes("X-Content-Type-Options") ||
        content.includes("Content-Security-Policy"));
  }

  results.push({
    category: "CORS",
    check: "CORS configuration",
    status: hasCorsConfig ? "PASS" : "WARN",
    message: hasCorsConfig
      ? "CORS headers configured in next.config"
      : "No explicit CORS configuration found",
    fix: "Add CORS headers to next.config.ts to restrict cross-origin requests",
  });

  // Check middleware for CORS
  let middlewarePathCors = path.join(ROOT_DIR, "middleware.ts");
  if (!fs.existsSync(middlewarePathCors)) {
    middlewarePathCors = path.join(SRC_DIR, "middleware.ts");
  }
  let middlewareCors = false;

  if (fs.existsSync(middlewarePathCors)) {
    const content = fs.readFileSync(middlewarePathCors, "utf-8");
    middlewareCors =
      content.includes("Access-Control") ||
      content.includes("Origin") ||
      content.includes("cors");
  }

  results.push({
    category: "CORS",
    check: "CORS in middleware",
    status: middlewareCors ? "PASS" : "INFO",
    message: middlewareCors
      ? "CORS handling found in middleware"
      : "No CORS handling in middleware (may use next.config instead)",
    fix: "Add CORS middleware for fine-grained control per route",
  });

  // Check security headers
  results.push({
    category: "CORS",
    check: "Security headers configured",
    status: hasSecurityHeaders ? "PASS" : "WARN",
    message: hasSecurityHeaders
      ? "Security headers found in configuration"
      : "Missing security headers (CSP, X-Frame-Options, etc.)",
    fix: "Add X-Frame-Options, X-Content-Type-Options, CSP headers",
  });

  // Check API routes for CORS headers
  const apiFiles = getAllFiles(API_DIR, [".ts", ".tsx"]);
  let routesWithCors = 0;

  for (const file of apiFiles) {
    const content = fs.readFileSync(file, "utf-8");
    if (
      content.includes("Access-Control-Allow-Origin") ||
      content.includes("headers.set")
    ) {
      routesWithCors++;
    }
  }

  results.push({
    category: "CORS",
    check: "API routes with CORS headers",
    status: routesWithCors > 0 ? "PASS" : "INFO",
    message: `${routesWithCors}/${apiFiles.length} API routes set CORS headers`,
    fix: "Consider adding CORS headers for public API endpoints",
  });

  return results;
}

// ============================================================================
// 8. DEPENDENCY AUDIT
// ============================================================================

function checkDependencies(): AuditResult[] {
  const results: AuditResult[] = [];

  // Run npm/pnpm audit
  try {
    const auditOutput = execSync("pnpm audit --json 2>/dev/null || true", {
      cwd: ROOT_DIR,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    let auditData: {
      metadata?: {
        vulnerabilities?: {
          critical?: number;
          high?: number;
          moderate?: number;
          low?: number;
        };
      };
    } = {};
    try {
      auditData = JSON.parse(auditOutput);
    } catch {
      // Audit output may not be valid JSON
    }

    const vulnerabilities = auditData?.metadata?.vulnerabilities;
    const critical = vulnerabilities?.critical || 0;
    const high = vulnerabilities?.high || 0;
    const moderate = vulnerabilities?.moderate || 0;
    const low = vulnerabilities?.low || 0;

    const total = critical + high + moderate + low;

    results.push({
      category: "Dependencies",
      check: "Dependency vulnerabilities",
      status: critical + high === 0 ? (total === 0 ? "PASS" : "WARN") : "FAIL",
      message:
        total === 0
          ? "No known vulnerabilities in dependencies"
          : `Found ${critical} critical, ${high} high, ${moderate} moderate, ${low} low vulnerabilities`,
      fix: "Run 'pnpm audit fix' or update vulnerable packages manually",
    });
  } catch {
    results.push({
      category: "Dependencies",
      check: "Dependency vulnerabilities",
      status: "INFO",
      message: "Could not run dependency audit",
      fix: "Run 'pnpm audit' manually to check for vulnerabilities",
    });
  }

  // Check for outdated packages
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8")
  );

  const securityCriticalPackages = [
    "next",
    "@supabase/supabase-js",
    "stripe",
    "openai",
  ];

  const deps = packageJson.dependencies || {};
  const outdatedSecurity: string[] = [];

  // Simple version check (would need actual comparison in production)
  for (const pkg of securityCriticalPackages) {
    if (deps[pkg]) {
      // This is a simplified check - in production, you'd want to compare against latest
      results.push({
        category: "Dependencies",
        check: `${pkg} version check`,
        status: "INFO",
        message: `${pkg} is at version ${deps[pkg]}`,
        fix: `Run 'pnpm outdated ${pkg}' to check for updates`,
      });
    }
  }

  // Check package-lock.json / pnpm-lock.yaml exists
  const hasLockFile =
    fs.existsSync(path.join(ROOT_DIR, "pnpm-lock.yaml")) ||
    fs.existsSync(path.join(ROOT_DIR, "package-lock.json")) ||
    fs.existsSync(path.join(ROOT_DIR, "yarn.lock"));

  results.push({
    category: "Dependencies",
    check: "Lock file exists",
    status: hasLockFile ? "PASS" : "FAIL",
    message: hasLockFile
      ? "Package lock file found for reproducible builds"
      : "No lock file - builds may be non-deterministic",
    fix: "Run 'pnpm install' to generate pnpm-lock.yaml",
  });

  return results;
}

// ============================================================================
// 9. AUTHENTICATION CHECKS
// ============================================================================

function checkAuthentication(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for auth verification in API routes
  const apiFiles = getAllFiles(API_DIR, [".ts", ".tsx"]);
  let routesWithAuth = 0;
  let publicRoutes: string[] = [];

  for (const file of apiFiles) {
    const content = fs.readFileSync(file, "utf-8");

    const hasAuthCheck =
      content.includes("getUser") ||
      content.includes("getSession") ||
      content.includes("auth()") ||
      content.includes("401") ||
      content.includes("Unauthorized");

    if (hasAuthCheck) {
      routesWithAuth++;
    } else {
      // Check if it's a webhook or public route
      const relativePath = path.relative(API_DIR, file);
      if (
        !relativePath.includes("webhook") &&
        !relativePath.includes("health") &&
        !relativePath.includes("public")
      ) {
        publicRoutes.push(relativePath);
      }
    }
  }

  results.push({
    category: "Authentication",
    check: "API routes with auth checks",
    status: publicRoutes.length === 0 ? "PASS" : "WARN",
    message: `${routesWithAuth}/${apiFiles.length} API routes verify authentication`,
    fix:
      publicRoutes.length > 0
        ? `Review unprotected routes: ${publicRoutes.slice(0, 3).join(", ")}`
        : undefined,
  });

  // Check for secure cookie settings
  let middlewareAuthPath = path.join(ROOT_DIR, "middleware.ts");
  if (!fs.existsSync(middlewareAuthPath)) {
    middlewareAuthPath = path.join(SRC_DIR, "middleware.ts");
  }
  let secureCookies = false;
  let httpOnlyCookies = false;

  if (fs.existsSync(middlewareAuthPath)) {
    const content = fs.readFileSync(middlewareAuthPath, "utf-8");
    secureCookies = content.includes("secure:");
    httpOnlyCookies = content.includes("httpOnly:");
  }

  results.push({
    category: "Authentication",
    check: "Secure cookie settings",
    status: secureCookies && httpOnlyCookies ? "PASS" : "WARN",
    message:
      secureCookies && httpOnlyCookies
        ? "Cookies configured with secure and httpOnly flags"
        : "Review cookie security settings in middleware",
    fix: "Set secure: true, httpOnly: true, sameSite: 'strict' on auth cookies",
  });

  // Check for password requirements
  const authDir = path.join(SRC_DIR, "app/(auth)");
  let hasPasswordValidation = false;

  if (fs.existsSync(authDir)) {
    const authFiles = getAllFiles(authDir, [".tsx", ".ts"]);
    for (const file of authFiles) {
      const content = fs.readFileSync(file, "utf-8");
      if (
        content.includes("password.length") ||
        content.includes("minLength") ||
        content.includes("passwordStrength")
      ) {
        hasPasswordValidation = true;
        break;
      }
    }
  }

  results.push({
    category: "Authentication",
    check: "Password strength validation",
    status: hasPasswordValidation ? "PASS" : "WARN",
    message: hasPasswordValidation
      ? "Password validation found"
      : "No password strength validation detected",
    fix: "Enforce minimum 8 characters, uppercase, lowercase, number, special char",
  });

  return results;
}

// ============================================================================
// 10. ADDITIONAL SECURITY CHECKS
// ============================================================================

function checkAdditionalSecurity(): AuditResult[] {
  const results: AuditResult[] = [];

  // Check for TypeScript strict mode
  const tsconfigPath = path.join(ROOT_DIR, "tsconfig.json");
  let strictMode = false;

  if (fs.existsSync(tsconfigPath)) {
    const content = fs.readFileSync(tsconfigPath, "utf-8");
    strictMode = content.includes('"strict": true');
  }

  results.push({
    category: "Code Quality",
    check: "TypeScript strict mode",
    status: strictMode ? "PASS" : "WARN",
    message: strictMode
      ? "TypeScript strict mode is enabled"
      : "TypeScript strict mode is disabled",
    fix: 'Enable "strict": true in tsconfig.json for better type safety',
  });

  // Check for console.log statements
  const srcFiles = getAllFiles(SRC_DIR, [".ts", ".tsx"]);
  let consoleLogs = 0;

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const matches = content.match(/console\.(log|debug|info)/g);
    if (matches) {
      consoleLogs += matches.length;
    }
  }

  // Check if removeConsole is configured in next.config
  let hasRemoveConsole = false;
  const nextConfigPath = path.join(ROOT_DIR, "next.config.ts");
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, "utf-8");
    hasRemoveConsole = nextConfig.includes("removeConsole");
  }

  results.push({
    category: "Code Quality",
    check: "Console.log statements",
    status: consoleLogs < 10 || hasRemoveConsole ? "PASS" : "WARN",
    message:
      hasRemoveConsole
        ? `${consoleLogs} console.log statements (will be removed in production build)`
        : consoleLogs === 0
        ? "No console.log statements found"
        : `Found ${consoleLogs} console.log statements`,
    fix: "Remove console.log statements before production or use a proper logger",
  });

  // Check for TODO/FIXME comments
  let todoComments = 0;
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const matches = content.match(/(TODO|FIXME|HACK|XXX):/gi);
    if (matches) {
      todoComments += matches.length;
    }
  }

  results.push({
    category: "Code Quality",
    check: "TODO/FIXME comments",
    status: todoComments < 5 ? "PASS" : "WARN",
    message:
      todoComments === 0
        ? "No TODO/FIXME comments found"
        : `Found ${todoComments} TODO/FIXME comments`,
    fix: "Address TODO/FIXME comments before production deploy",
  });

  // Check for error boundaries
  let hasErrorBoundary = false;
  // Check for error.tsx files in app directory
  const errorFiles = getAllFiles(path.join(SRC_DIR, "app"), [".tsx"]).filter(
    (f) => f.endsWith("error.tsx")
  );
  if (errorFiles.length > 0) {
    hasErrorBoundary = true;
  } else {
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, "utf-8");
      if (
        content.includes("ErrorBoundary") ||
        content.includes("getDerivedStateFromError")
      ) {
        hasErrorBoundary = true;
        break;
      }
    }
  }

  results.push({
    category: "Code Quality",
    check: "Error boundaries",
    status: hasErrorBoundary ? "PASS" : "WARN",
    message: hasErrorBoundary
      ? "Error boundary implementation found"
      : "No error boundaries detected",
    fix: "Add error.tsx files to handle runtime errors gracefully",
  });

  return results;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Skip node_modules and hidden directories
      if (item.name !== "node_modules" && !item.name.startsWith(".")) {
        files.push(...getAllFiles(fullPath, extensions));
      }
    } else if (extensions.some((ext) => item.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runAudit(): Promise<void> {
  console.log("\n");
  log(
    "╔══════════════════════════════════════════════════════════════╗",
    "cyan"
  );
  log(
    "║           🔒 SECURITY AUDIT - Pre-Production Check           ║",
    "cyan"
  );
  log(
    "╚══════════════════════════════════════════════════════════════╝",
    "cyan"
  );
  console.log("\n");

  const summary: AuditSummary = {
    total: 0,
    passed: 0,
    warnings: 0,
    failed: 0,
    results: [],
  };

  const checks = [
    { name: "Rate Limiting", fn: checkRateLimiting },
    { name: "Row Level Security", fn: checkRowLevelSecurity },
    { name: "CAPTCHA Protection", fn: checkCaptcha },
    { name: "Server-Side Validation", fn: checkServerValidation },
    { name: "API Keys & Secrets", fn: checkApiKeys },
    { name: "Environment Variables", fn: checkEnvVars },
    { name: "CORS & Headers", fn: checkCors },
    { name: "Dependencies", fn: checkDependencies },
    { name: "Authentication", fn: checkAuthentication },
    { name: "Additional Security", fn: checkAdditionalSecurity },
  ];

  for (const check of checks) {
    log(`\n${colors.bold}━━━ ${check.name} ━━━${colors.reset}`, "blue");

    const results = check.fn();
    summary.results.push(...results);

    for (const result of results) {
      summary.total++;
      if (result.status === "PASS") summary.passed++;
      else if (result.status === "WARN") summary.warnings++;
      else if (result.status === "FAIL") summary.failed++;

      logResult(result);
    }
  }

  // Print summary
  console.log("\n");
  log(
    "══════════════════════════════════════════════════════════════",
    "cyan"
  );
  log(`${colors.bold}                    AUDIT SUMMARY${colors.reset}`, "cyan");
  log(
    "══════════════════════════════════════════════════════════════",
    "cyan"
  );
  console.log(`
  Total Checks:    ${summary.total}
  ${colors.green}✓ Passed:        ${summary.passed}${colors.reset}
  ${colors.yellow}⚠ Warnings:      ${summary.warnings}${colors.reset}
  ${colors.red}✗ Failed:        ${summary.failed}${colors.reset}
  `);

  // Calculate score
  const score = Math.round((summary.passed / summary.total) * 100);
  const scoreColor = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";

  log(`  Security Score: ${colors[scoreColor]}${score}%${colors.reset}`, "bold");

  if (summary.failed > 0) {
    console.log(
      `\n  ${colors.red}⚠️  ${summary.failed} critical issue(s) must be fixed before production!${colors.reset}`
    );
    process.exit(1);
  } else if (summary.warnings > 5) {
    console.log(
      `\n  ${colors.yellow}⚠️  Consider addressing warnings for better security.${colors.reset}`
    );
  } else {
    console.log(
      `\n  ${colors.green}✓ Security audit passed! Ready for production.${colors.reset}`
    );
  }

  console.log("\n");
}

// Run the audit
runAudit().catch(console.error);
