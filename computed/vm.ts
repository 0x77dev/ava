import { VM } from 'vm2'
import type { VMOptions } from './interfaces'

export const runInVM = ({ input, id = 0, context = {} }: VMOptions): string => {
  try {
    const vm = new VM({
      wasm: false,
      timeout: 5000
    })

    vm.setGlobals(context)

    return vm.run(input, {
      filename: `vm-${id}.js`
    })
  } catch (error) {
    console.error(error)
    return `error$${id}`
  }
}
