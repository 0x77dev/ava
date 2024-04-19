import { createAssistant, type ToolInterface } from "@ava/lang";

let assistant: Awaited<ReturnType<typeof createAssistant>> | null = null

export const getAssistant = async () => {
  if (assistant) {
    return assistant
  }

  const tools: ToolInterface[] = []

  if (process.env.HOMEASSISTANT) {
    const { createHomeAssistantToolkit } = await import('@ava/skills-homeassistant')
    tools.push(...await createHomeAssistantToolkit())
  }

  assistant = await createAssistant(tools)
  return assistant
}
