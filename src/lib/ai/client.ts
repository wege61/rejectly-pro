import OpenAI from "openai";
import { config } from "@/lib/config";

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Override with OPENAI_MODEL to switch models without a code change.
// Prompts other than CV generation were written for gpt-4o-mini; gpt-6-luna
// writes much longer JSON for them (e.g. scoring hit the 4000-token limit and
// failed to parse), so test a prompt before moving it to another model.
// GPT-5+ models reject `max_tokens`; use `max_completion_tokens` in every call.
export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// CV generation was evaluated on gpt-6-luna: it rewrites weak bullets far
// better than gpt-4o-mini without inventing facts.
export const CV_MODEL = process.env.OPENAI_CV_MODEL || "gpt-6-luna";

// Some models (e.g. gpt-6-luna) only accept the default temperature. Rather than
// special-casing every call site, drop the parameter and retry once, and remember
// the model so later calls skip the failed attempt.
const modelsWithoutTemperature = new Set<string>();
const create = openai.chat.completions.create.bind(openai.chat.completions);

function withoutTemperature(body: OpenAI.Chat.ChatCompletionCreateParams) {
  const copy = { ...body };
  delete copy.temperature;
  return copy;
}

function isTemperatureRejection(err: unknown): boolean {
  return err instanceof OpenAI.APIError && err.status === 400 && err.param === "temperature";
}

openai.chat.completions.create = (async (body: OpenAI.Chat.ChatCompletionCreateParams, options?: OpenAI.RequestOptions) => {
  if (body.temperature !== undefined && modelsWithoutTemperature.has(body.model)) {
    return create(withoutTemperature(body), options);
  }
  try {
    return await create(body, options);
  } catch (err) {
    if (body.temperature === undefined || !isTemperatureRejection(err)) throw err;
    modelsWithoutTemperature.add(body.model);
    return create(withoutTemperature(body), options);
  }
}) as typeof openai.chat.completions.create;
