import { DynamicTool, type ToolInterface } from '@ava/lang'
import { SKILLS } from './config'
import { http } from './provider/http'

export const createDynamicToolkit = async (): Promise<ToolInterface[]> => {
  return SKILLS.map((skill) => {
    console.info(`[Dynamic Skill] creating dynamic tool for ${skill.name} at ${skill.url}`)

    return new DynamicTool({
      name: skill.name,
      description: skill.description,
      returnDirect: skill.returnDirect,
      async func(body) {
        const response = await http.post(skill.url, {
          body,
          responseType: 'json'
        }).text()

        return response
      }
    })
  })
}
