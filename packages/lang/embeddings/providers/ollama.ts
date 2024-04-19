import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import type { Embeddings } from "../schema";

export const ollama = (model: Embeddings) => {
  return new OllamaEmbeddings({
    model: model.name,
    baseUrl: model.baseURL,
  })
}
