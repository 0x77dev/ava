import { parseEnv } from "znv";
import { EmbeddingsSchema } from "./schema";

export const { EMBEDDINGS } = parseEnv(process.env, {
  EMBEDDINGS: {
    schema: EmbeddingsSchema,
    description: "Embeddings configuration"
  }
})
