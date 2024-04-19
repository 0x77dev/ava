import { parseEnv } from "znv";
import { HomeassistantSchema } from "./schema";

export const { HOMEASSISTANT } = parseEnv(process.env, {
  HOMEASSISTANT: {
    schema: HomeassistantSchema,
    description: "Home Assistant configuration"
  }
})