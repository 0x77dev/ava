import { z } from "zod"
import { tmpdir } from "os"
import { join } from "path"

export const EmbeddingsNamespaceSchema = z.enum(["llama-cpp", "ollama", "openai"])

export type ModelNamespace = z.infer<typeof EmbeddingsNamespaceSchema>

export const EmbeddingsNameSchema = z.string().min(1)
export type EmbeddingsName = z.infer<typeof EmbeddingsNameSchema>

export const EmbeddingsSchema = z.object({
  namespace: EmbeddingsNamespaceSchema,
  name: EmbeddingsNameSchema,
  token: z.optional(z.string()),
  baseURL: z.optional(z.string().url()),
  extra: z.any(),
}).default({
  namespace: "llama-cpp",
  baseURL: `file://${join(tmpdir(), "ava", "llama-cpp", "nomic-embed-text-v1-GGUF")}`,
  name: "https://huggingface.co/nomic-ai/nomic-embed-text-v1-GGUF/resolve/main/nomic-embed-text-v1.Q4_K_M.gguf?download=true",
  extra: {
    contextSize: 8192,
    batchSize: 8192,
  }
})

export type Embeddings = z.infer<typeof EmbeddingsSchema>
