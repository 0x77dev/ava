import { ChatOpenAI } from "@langchain/openai";
import type { LLM } from "../schema";

export const openai = (model: LLM) => {
  return new ChatOpenAI({
    model: model.name,
    apiKey: model.token,
    verbose: true
  })
}
