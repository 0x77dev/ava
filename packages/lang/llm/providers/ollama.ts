import { ChatOllama } from "langchain/chat_models/ollama";
import type { LLM } from "../schema";
import { pullModel } from "../../services/ollama";

export const ollama = async (model: LLM) => {
  await pullModel(model.name, model.baseURL)
  return new ChatOllama({
    model: model.name,
    baseUrl: model.baseURL,
    verbose: true
  })
}
