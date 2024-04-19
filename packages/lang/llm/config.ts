import { parseEnv, z } from "znv";
import { LLMSchema } from "./schema";

export const { LLM } = parseEnv(process.env, {
  LLM: {
    schema: z.string().transform((value) => LLMSchema.parse(JSON.parse(value))),
    description: "LLM configuration"
  }
})
