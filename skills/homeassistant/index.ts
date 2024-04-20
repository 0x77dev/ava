import { type ToolInterface } from '@ava/lang'
import { entities } from './tools/entities'
import { call, services } from './tools/services'

export const createHomeAssistantToolkit = async (): Promise<ToolInterface[]> => {
  return [
    await entities(),
    await services(),
    await call()
  ]
}
