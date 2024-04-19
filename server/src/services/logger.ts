import { logger } from "@bogeychan/elysia-logger";
import { LOG_LEVEL } from "./config";

export const elysiaLogger =  logger({
  name: '@ava/server',
  level: LOG_LEVEL
})
