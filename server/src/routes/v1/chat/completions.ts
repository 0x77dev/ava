import type { CreateChatCompletionRequest, CreateChatCompletionResponse } from "@ava/oai-types";
import type { ElysiaApp } from "~/index";
import { executeChatCompletion } from "~/services/oai/lang";

export default (app: ElysiaApp) => {
  return app.post('/', async ({ body }): Promise<CreateChatCompletionResponse> => {
    return executeChatCompletion(body as CreateChatCompletionRequest)
  }, {
    type: 'json'
  })
}
