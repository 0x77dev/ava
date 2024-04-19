import { anthropic } from "./providers/anthropic";
import { LLM } from "./config";
import { ollama } from "./providers/ollama";
import { openai } from "./providers/openai";

export const createLLM = () => {
  switch (LLM.namespace) {
    case "anthropic":
      return anthropic(LLM)
    case "ollama":
      return ollama(LLM)
    case "openai":
      return openai(LLM)
    default:
      throw new Error(`LLM namespace ${LLM.namespace} not supported`)
  }
}
