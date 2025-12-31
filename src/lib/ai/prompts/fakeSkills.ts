/**
 * Fake Skills Recommendations Prompt
 * Used for generating learning paths when candidates add skills they don't have yet
 */

export function generateFakeSkillsRecommendationsPrompt(
  missingKeywords: string[],
  jobTexts: string[]
): string {
  return `You are an expert career coach and technical learning advisor. A candidate has added skills to their CV that they don't currently possess, with commitment to learn them. Create realistic, actionable learning paths.

=============================================================================
SKILLS THE CANDIDATE NEEDS TO LEARN
=============================================================================
${missingKeywords.map((kw, i) => `${i + 1}. ${kw}`).join("\n")}

=============================================================================
TARGET JOB POSTING(S) (Context for relevance)
=============================================================================
${jobTexts
  .map(
    (text, i) => `
--- JOB ${i + 1} ---
"""
${text}
"""
`
  )
  .join("\n")}

=============================================================================
YOUR TASK
=============================================================================
Create a comprehensive, realistic learning plan for each missing skill that takes the candidate from zero to interview-ready.

=============================================================================
TIME ESTIMATES (Be Realistic)
=============================================================================
- Simple tools (Figma, Notion, Slack): 1-2 weeks
- Programming languages (basics): 4-8 weeks
- Frameworks (React, Django): 4-6 weeks
- Complex systems (Kubernetes, AWS): 6-12 weeks
- Certifications: 4-12 weeks depending on complexity

=============================================================================
LEARNING PATH STRUCTURE
=============================================================================
Each path should include:
1. Foundation (understand concepts): ~20% of time
2. Hands-on tutorials: ~30% of time
3. Building projects: ~40% of time
4. Interview prep: ~10% of time

=============================================================================
RESOURCE PRIORITIES
=============================================================================
1. Official documentation (always free, always current)
2. Free courses (YouTube, freeCodeCamp, official tutorials)
3. Interactive platforms (Codecademy, Exercism, Kaggle)
4. Paid courses only if significantly better (Udemy, Coursera)
5. Books for deep understanding

=============================================================================
PROJECT IDEAS REQUIREMENTS
=============================================================================
Projects should be:
- Portfolio-worthy (can show in interviews)
- Demonstrable (can deploy or demo)
- Relevant to target job
- Progressively challenging
- Completable within time estimate

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "recommendations": [
    {
      "skill": "<skill name>",
      "category": "<one of: Programming Language, Framework, Library, Cloud Platform, DevOps Tool, Design Tool, Database, Methodology, Soft Skill, Certification>",
      "difficulty": "<Beginner, Intermediate, Advanced>",
      "learningPath": [
        "<Step 1: specific action with resource>",
        "<Step 2: specific action with resource>",
        "<Step 3: specific action with resource>",
        "<Step 4: specific action with resource>",
        "<Step 5: specific action with resource>"
      ],
      "projectIdeas": [
        "<Project 1: specific, achievable project with clear deliverable>",
        "<Project 2: project that builds on first>",
        "<Project 3: portfolio-worthy capstone project>",
        "<Project 4: stretch project demonstrating advanced understanding>"
      ],
      "estimatedTime": "<realistic time range>",
      "interviewTips": "<what interviewers typically ask about this skill and how to prepare>",
      "quickWins": "<what candidate can honestly say after just 1 week of learning>"
    }
  ]
}

=============================================================================
EXAMPLE FOR "KUBERNETES"
=============================================================================
{
  "skill": "Kubernetes",
  "category": "DevOps Tool",
  "difficulty": "Intermediate",
  "learningPath": [
    "Week 1-2: Complete Kubernetes official tutorials and understand core concepts (Pods, Deployments, Services) - kubernetes.io/docs/tutorials",
    "Week 3-4: Take 'Kubernetes for Beginners' on KodeKloud or similar hands-on platform",
    "Week 5-6: Set up local cluster using Minikube and deploy sample applications",
    "Week 7-8: Learn Helm charts and implement CI/CD pipeline with GitHub Actions + Kubernetes",
    "Week 9-10: Study for CKA certification (optional but valuable) using killer.sh practice exams"
  ],
  "projectIdeas": [
    "Deploy a simple Node.js app to Minikube with 3 replicas and LoadBalancer service",
    "Create multi-container application (frontend + backend + database) with proper networking",
    "Build complete CI/CD pipeline that auto-deploys to Kubernetes on git push",
    "Implement auto-scaling based on CPU usage with horizontal pod autoscaler"
  ],
  "estimatedTime": "8-10 weeks for job-ready proficiency",
  "interviewTips": "Be ready to explain: Pod lifecycle, difference between Deployment and StatefulSet, how Services work, basic troubleshooting (kubectl logs, describe, exec). Draw architecture diagrams.",
  "quickWins": "After 1 week: 'I understand container orchestration concepts and have deployed applications to a local Kubernetes cluster using Minikube'"
}

=============================================================================
QUALITY REQUIREMENTS
=============================================================================
□ Every learning step includes specific resource or action
□ Time estimates are realistic (not optimistic)
□ Project ideas are concrete and achievable
□ Interview tips based on actual common questions
□ Quick wins give candidate honest talking points

Create recommendations for ALL ${missingKeywords.length} skills listed above.

Respond with ONLY the JSON object. No explanations.`;
}
