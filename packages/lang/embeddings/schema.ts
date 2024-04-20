import { z } from "zod"

export const EmbeddingsNamespaceSchema = z.enum(["ollama", "openai"])

export type ModelNamespace = z.infer<typeof EmbeddingsNamespaceSchema>

export const EmbeddingsNameSchema = z.string().min(1)
export type EmbeddingsName = z.infer<typeof EmbeddingsNameSchema>

export const EmbeddingsSchema = z.object({
  namespace: EmbeddingsNamespaceSchema,
  name: EmbeddingsNameSchema,
  token: z.optional(z.string()),
  baseURL: z.optional(z.string().url()),
  extra: z.any(),
})

export type Embeddings = z.infer<typeof EmbeddingsSchema>
