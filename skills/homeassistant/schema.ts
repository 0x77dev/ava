import { z } from "zod";

export const HomeassistantSchema = z.object({
  url: z.string().url(),
  token: z.string(),
  disabledEntitiesPrefixes: z.array(z.string()).default(['update', 'device_tracker']),
  supervisor: z.boolean().default(Boolean(process.env.SUPERVISOR_TOKEN)),
})

export type Homeassistant = z.infer<typeof HomeassistantSchema>
