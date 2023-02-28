import type { Example } from '../gpt3/instructions'
import type { Middleware } from '../gpt3/middlewares/interfaces'
import type { VMModule } from './interfaces'
import { render } from './parser'

export const getVMMiddleware = (modules: VMModule[] = []): Middleware => {
  const vmContext = modules.reduce<Record<string, any>>((acc, module) => {
    if (!module.vm) return acc
    return {
      ...acc,
      ...module.vm.context
    }
  }, {})

  const gpt3Context = modules.reduce<string[]>((acc, module) => {
    if (!module.gpt3) return acc
    return [...acc, ...(module.gpt3.context ?? [])]
  }, [])

  const gpt3Examples = modules.reduce<Example[]>((acc, module) => {
    if (!module.gpt3) return acc
    return [...acc, ...(module.gpt3.examples ?? [])]
  }, [])

  return {
    id: 'vm',
    after: async (input) => {
      const rendered = await render(input, { context: vmContext })

      return rendered.output
    },
    gpt3: {
      context: gpt3Context,
      examples: gpt3Examples
    }
  }
}
