import { DynamicStructuredTool, DynamicTool, type ToolInterface } from "@langchain/core/tools";
import { createAgent } from "../agent";
import { AgentExecutor } from "langchain/agents";
import { js2xml, type ElementCompact } from "xml-js";

export const createAssistant = async (tools: ToolInterface[]) => {
  const agent = await createAgent(tools)

  return new AgentExecutor({
    agent,
    tools
  })
}

export const formatAnswer = (answer: ElementCompact) => {
  return js2xml(answer, {
    compact: true,
    ignoreCdata: true,
    ignoreAttributes: false,
    ignoreInstruction: true,
  })
}

export { DynamicStructuredTool, DynamicTool, type ToolInterface }
export { AIMessage, SystemMessage, HumanMessage } from "@langchain/core/messages"
