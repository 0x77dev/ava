import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import type { Embeddings } from "../schema";

export const openai = (model: Embeddings) => {
  return new OpenAIEmbeddings({
    model: model.name,
    apiKey: model.token,
    verbose: true
  })
}
