import { ChatAnthropic } from "@langchain/anthropic";
import type { LLM } from "../schema";

export const anthropic = (schema: LLM) => {
  if (!schema.token) {
    throw new Error('Anthropic requires a token')
  }

  return new ChatAnthropic({
    model: schema.name,
    anthropicApiKey: schema.token,
    anthropicApiUrl: schema.baseURL,
    verbose: true
  })
}
