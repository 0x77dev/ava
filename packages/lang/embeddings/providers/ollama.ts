import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import type { Embeddings } from "../schema";
import { pullModel } from "../../services/ollama";

export const ollama = async (model: Embeddings) => {
  await pullModel(model.name, model.baseURL)

  return new OllamaEmbeddings({
    model: model.name,
    baseUrl: model.baseURL,
  })
}
