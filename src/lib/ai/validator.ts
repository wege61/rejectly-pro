import { openai } from "./client";

export async function isValidJobDescription(text: string): Promise<boolean> {
  try {
    const prompt = `You are a binary classification filter. Your goal is to determine if the provided text is a Job Description (or a reasonable attempt at one), or if it is absolute nonsense/spam (e.g., keyboard mashing, single words, gibberish).

Respond ONLY with "YES" if it could reasonably be a job description, or "NO" if it is undeniable nonsense.

Text to evaluate:
"""
${text.substring(0, 1000)} // Only check the first 1000 chars to save tokens
"""`;

    // We use mini here because it's an extremely simple binary classification task
    // and we want it to be as fast and cheap as possible.
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 2,
    });

    const answer = response.choices[0]?.message?.content?.trim().toUpperCase();
    
    // We only block if it explicitly says NO. Otherwise we fail open.
    return answer !== "NO";
  } catch (error) {
    console.error("Job validation error:", error);
    // Fail open: If our validation API goes down, we shouldn't block normal user flows.
    return true; 
  }
}
