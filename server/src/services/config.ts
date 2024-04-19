import {parseEnv, port, z} from 'znv'

export const { PORT, LOG_LEVEL } = parseEnv(process.env, {
  PORT: {
    schema: port().default(2881),
    description: 'Port for HTTP server to listen on'
  },
  LOG_LEVEL: {
    schema: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default('info'),
    description: 'Log level for the server'
  }
})
