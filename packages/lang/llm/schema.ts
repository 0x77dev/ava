import { z } from "zod"

export const LLMNamespaceSchema = z.enum(["anthropic", "ollama", "openai"])

export type LLMNamespace = z.infer<typeof LLMNamespaceSchema>

export const LLMNameSchema = z.string().min(1)
export type LLMName = z.infer<typeof LLMNameSchema>

export const LLMSchema = z.object({
  namespace: LLMNamespaceSchema,
  name: LLMNameSchema,
  token: z.optional(z.string()),
  baseURL: z.optional(z.string().url()),
})

export type LLM = z.infer<typeof LLMSchema>
