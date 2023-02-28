import type { Rendered, Entity, VMOptions } from './interfaces'
import { runInVM } from './vm'

const TEMPLATE_REGEX = /{\s*(.*?)\s*}}/gm

export const render = async (
  input: string,
  vm: Omit<VMOptions, 'input'> = {}
): Promise<Rendered> => {
  const matches = Array.from(new Set(input.match(TEMPLATE_REGEX)))

  const entities = matches
    .map((match): Entity => {
      const js = match.replaceAll('{{', '').replaceAll('}}', '')

      return {
        match,
        original: input,
        vm: { ...vm, input: js }
      }
    })
    .map((entity, i) => {
      entity.vm.id = i
      const result = runInVM(entity.vm)

      return {
        ...entity,
        result
      }
    })

  const output = entities.reduce((input, entity) => {
    return input.replaceAll(entity.match, entity.result)
  }, input)

  return {
    input,
    entities,
    output
  }
}
