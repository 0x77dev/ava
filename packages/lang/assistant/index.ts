import { DynamicStructuredTool, DynamicTool, type ToolInterface } from "@langchain/core/tools";
import { createAgent } from "../agent";
import { AgentExecutor } from "langchain/agents";
import { js2xml, xml2js, type ElementCompact } from "xml-js";

export const createAssistant = async (tools: ToolInterface[]): Promise<AgentExecutor> => {
  const agent = await createAgent(tools)

  return new AgentExecutor({
    agent,
    tools
  })
}

export const formatToolAnswer = (answer: ElementCompact) => {
  return js2xml(answer, {
    compact: true,
    ignoreCdata: true,
    ignoreAttributes: false,
    ignoreInstruction: true,
  })
}

export const parseXmlLikeResponse = (input: string) => {
  try {
    const data: ElementCompact = xml2js(`<root>${input}</root>`, {
      compact: true,
      ignoreCdata: true,
      ignoreAttributes: false,
      ignoreInstruction: true,
    })

    const result = data.root?._text?.length ?
      data.root._text :
      data.root.result._text

    const message = Array.isArray(result) ?
      result.join(' ') :
      result

    return {
      message,
      data: data.root
    }
  } catch (error) {
    console.warn('failed to parse xml-like response', input, error)
    return {
      message: input,
      data: { _text: input }
    }
  }
}

export { DynamicStructuredTool, DynamicTool, type ToolInterface }
export { AIMessage, SystemMessage, HumanMessage } from "@langchain/core/messages"
