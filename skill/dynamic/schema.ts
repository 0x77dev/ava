import { z } from "zod";

export const SkillSchema = z.object({
  name: z.string(),
  description: z.string(),
  // schema: z.optional(z.any()).describe('JSON schema if the skill requires input'),
  returnDirect: z.boolean().optional().describe('Whether the skill returns the result directly or not').default(false),
  url: z.string().url().describe('HTTP POST URL to send the data to'),
})
export type Skill = z.infer<typeof SkillSchema>

export const SkillListSchema = z.array(SkillSchema)
export type SkillList = z.infer<typeof SkillListSchema>
