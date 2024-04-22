import { parseEnv, z } from "znv";
import { SkillListSchema } from "./schema";

export const { SKILLS } = parseEnv(process.env, {
  SKILLS: {
    schema: z.string().transform((value) => SkillListSchema.parse(JSON.parse(value))),
    description: "Skills configuration"
  }
})
