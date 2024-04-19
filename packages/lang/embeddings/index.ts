import { EMBEDDINGS } from "./config";
import { llamaCpp } from "./providers/llama-cpp";
import { ollama } from "./providers/ollama";
import { openai } from "./providers/openai";

export const createEmbeddings = () => {
  switch (EMBEDDINGS.namespace) {
    case "ollama":
      return ollama(EMBEDDINGS)
    case "openai":
      return openai(EMBEDDINGS)
    case "llama-cpp":
      return llamaCpp(EMBEDDINGS)
  }
}

export { Document } from "@langchain/core/documents"
export { HNSWLib } from "@langchain/community/vectorstores/hnswlib"
export { MemoryVectorStore } from "langchain/vectorstores/memory"
export { SynchronousInMemoryDocstore } from "@langchain/community/stores/doc/in_memory"
export * from "hnswlib-node"
