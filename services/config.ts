import set from 'set-value'
import { z } from 'zod'

const schema = z.object({
  isProduction: z.boolean(),
  openai: z.object({
    apiKey: z.string()
  })
})

export type Config = z.infer<typeof schema>

const parseConfig = (
  input: NodeJS.ProcessEnv | Record<string, string> = process.env
): Config => {
  const output: Partial<Config> = {
    isProduction: process.env['NODE_ENV'] === 'production'
  }

  for (let [key, value] of Object.entries(input)) {
    if (!key.startsWith('config__')) continue
    key = key.replace('config__', '')
    key = key.replaceAll('__', '.')

    set(output, key, value, { merge: true })
  }

  return schema.parse(output)
}

export const config = parseConfig()
