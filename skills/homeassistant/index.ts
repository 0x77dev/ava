import { createAssistant, type ToolInterface } from '@ava/lang'
import { entities } from './tools/entities'
import { call, services } from './tools/services'

export const createHomeAssistantToolkit = async (): Promise<ToolInterface[]> => {
  return [
    await entities(),
    await services(),
    await call()
  ]
}

const assistant = await createAssistant(await createHomeAssistantToolkit())

console.log(await assistant.invoke({
  input: 'turn off the lights in bedroom area',
}))