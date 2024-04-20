import type { ChatCompletionRequestMessage, CreateChatCompletionRequest, CreateChatCompletionResponse } from "@ava/oai-types"
import { v4 } from "uuid"
import { getAssistant } from "../assistant"
import { AIMessage, HumanMessage, SystemMessage } from "@ava/lang"

const oaiToLangMessage = (messages: ChatCompletionRequestMessage[]) => {
  return messages.map(({role, content}) => {
    if(!content) return

    switch (role) {
      case 'user':
        return new HumanMessage(content)
      case 'assistant':
        return new AIMessage(content)
      case 'system':
        return new SystemMessage(content)
      default:
        return
    }
  }).filter(Boolean)
}

export const executeChatCompletion = async (req: CreateChatCompletionRequest): Promise<CreateChatCompletionResponse> => {
  const id = v4()
  const assistant = await getAssistant()

  if(req.stream) {
    throw new Error('streaming is not supported yet')
  }

  const lastMessage = req.messages[req.messages.length - 1]
  if (lastMessage.role !== 'user') {
    throw new Error('last message must be from user role')
  }
  const input = lastMessage.content
  const chat_history = oaiToLangMessage(req.messages.slice(0, -1))


  const res = await assistant.invoke({
    input,
    chat_history,
  }, {
    configurable: {
      sessionId: id
    }
  })

  return {
    id,
    model: 'ava',
    choices: [
      {
        index: 0,
        finish_reason: 'stop',
        message: res.output,
      }
    ],
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000)
  }
}
