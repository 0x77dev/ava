import { createToolCallingAgent, createXmlAgent } from "langchain/agents"
import { createLLM } from "../llm"
import { LLM } from "../llm/config"
import { kindToPrompt, namespaceToKind } from "./mappings"
import type { ToolInterface } from "@langchain/core/tools"

export const createAgent = async (tools: ToolInterface[]) => {
  const kind = namespaceToKind[LLM.namespace]
  const prompt = kindToPrompt[kind]
  const llm = await createLLM()

  switch (kind) {
    case "xml":
      return createXmlAgent({
        llm,
        prompt,
        tools
      })
    case "native":
      return createToolCallingAgent({
        llm,
        prompt,
        tools
      })
  }
}
