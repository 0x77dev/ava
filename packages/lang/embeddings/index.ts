import { EMBEDDINGS } from "./config";
import { ollama } from "./providers/ollama";
import { openai } from "./providers/openai";

export const createEmbeddings = () => {
  switch (EMBEDDINGS.namespace) {
    case "ollama":
      return ollama(EMBEDDINGS)
    case "openai":
      return openai(EMBEDDINGS)
  }
}

export { Document } from "@langchain/core/documents"
export { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
export { MemoryVectorStore } from "langchain/vectorstores/memory"
export { SynchronousInMemoryDocstore } from "@langchain/community/stores/doc/in_memory"
export * from "hnswlib-node"
