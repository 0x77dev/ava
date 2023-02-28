import merge from 'lodash.merge'
import type { Middleware } from './middlewares/interfaces'

export interface Example {
  human: string
  ai: string
}

export interface Instructions {
  context: string[]
  examples: Example[]
}

export const renderInstructions = (input: Instructions): string => `
The following is a conversation with an AI assistant.
The assistant is helpful, creative, clever, and very friendly.
If you are unsure about result is true, wrap javascript code in {{  }} for templating, templating should be valid javascript, and should not contain any non-code.
${input.context.join('\n')}

Human: Which date is it?
AI: Today is {{ new Date().toLocaleDateString() }}.
${input.examples
  .map((example) => `Human: ${example.human}\nAI: ${example.ai}\n`)
  .join('\n')}
Human:${' '}
`

export const getInstructions = (
  instructions: Instructions,
  middlewares: Middleware[]
): string => {
  const extracted = middlewares.reduce<Partial<Instructions>>(
    (acc, middleware) => {
      if (!middleware.gpt3) return acc
      return merge(acc, middleware.gpt3)
    },
    {}
  )

  return renderInstructions(merge(extracted, instructions))
}
