import OpenAI from "openai";
import { config } from "@/lib/config";

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const AI_MODEL = "gpt-4o-mini";
