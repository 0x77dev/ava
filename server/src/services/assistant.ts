import { createAssistant, type ToolInterface } from "@ava/lang";

let assistant: Awaited<ReturnType<typeof createAssistant>> | null = null

export const getAssistant = async () => {
  if (assistant) {
    return assistant
  }

  const tools: ToolInterface[] = []

  if (process.env.HOMEASSISTANT) {
    const { createHomeAssistantToolkit } = await import('@ava/skill-homeassistant')
    tools.push(...await createHomeAssistantToolkit())
  }

  if (process.env.SKILLS) {
    const { createDynamicToolkit } = await import('@ava/skill-dynamic')
    tools.push(...await createDynamicToolkit())
  }

  assistant = await createAssistant(tools)
  return assistant
}
