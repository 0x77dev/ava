import { getVMMiddleware } from '../computed'
import { runAfter, runBefore } from './middlewares'
import type { Middleware } from './middlewares/interfaces'
import { openai } from '../services/openai'
import { getInstructions, type Instructions } from './instructions'

export const DEFAULT_MIDDLEWARES: Middleware[] = [getVMMiddleware()]

export const ask = async (
  input: string,
  instructions: Instructions,
  middlewares: Middleware[] = DEFAULT_MIDDLEWARES
): Promise<string> => {
  const prefix = getInstructions(instructions, middlewares)
  input = await runBefore(input, middlewares)

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${prefix}${input}`,
    temperature: 0.01,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [' Human:', ' AI:']
  })

  let result = response.data.choices[0]?.text
  if (!result) return ''
  result = result.split('AI: ')[1]?.trim() ?? result

  result = await runAfter(result, middlewares)

  return result
}
