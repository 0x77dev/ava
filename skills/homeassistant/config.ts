import { parseEnv, z } from "znv";
import { HomeassistantSchema } from "./schema";

export const { HOMEASSISTANT } = parseEnv(process.env, {
  HOMEASSISTANT: {
    schema: z.string().transform((value) => HomeassistantSchema.parse(JSON.parse(value))),
    description: "Home Assistant configuration"
  }
})
