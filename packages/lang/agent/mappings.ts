import { ChatPromptTemplate } from "@langchain/core/prompts"
import type { LLMNamespace } from "../llm/schema"
import type { AgentKind } from "./schema"

export const namespaceToKind: Record<LLMNamespace, AgentKind> = {
  anthropic: "native",
  ollama: "xml",
  openai: "native",
}

export const kindToPrompt: Record<AgentKind, ChatPromptTemplate> = {
  native: ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ['placeholder', '{agent_scratchpad}']
  ]),
  xml: ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ['system', '{agent_scratchpad}']
  ])
}
