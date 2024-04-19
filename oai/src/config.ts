import { parseEnv, port, } from "znv";

export const { PORT } = parseEnv(process.env, {
  PORT: port().default(2881)
})
