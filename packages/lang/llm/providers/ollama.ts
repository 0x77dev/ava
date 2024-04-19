import { ChatOllama } from "langchain/chat_models/ollama";
import type { LLM } from "../schema";

export const ollama = (model: LLM) => {
  return new ChatOllama({
    model: model.name,
    baseUrl: model.baseURL,
    verbose: true
  })
}
