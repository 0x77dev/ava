import { z } from "zod";

export const HomeassistantSchema = z.object({
  url: z.string().url(),
  token: z.string(),
  disabledEntitiesPrefixes: z.array(z.string()).default(['update', 'device_tracker']),
})

export type Homeassistant = z.infer<typeof HomeassistantSchema>
