import { Elysia, t } from "elysia";
import { PORT } from "./config";
import { v4 } from "uuid";
import { AIMessage, HumanMessage, SystemMessage, createAssistant } from "@ava/lang";
import { createHomeAssistantToolkit } from "@ava/skills-homeassistant";
import { logger } from "@bogeychan/elysia-logger";

const tools = [
  ...await createHomeAssistantToolkit()
]
const assistant = await createAssistant(tools)


new Elysia().use(
  logger({
    level: "debug",
  })
).post("/v1/chat/completions",
  // @ts-expect-error
  async (req, res) => {
    const id = v4();
    const { messages } = req.body;

    if (!messages.length) {
      return res.status(400).send("No messages provided");
    }

    const lc = messages.map(({ role, content }: {role: string; content: string}) => {
      switch (role) {
        case "assistant":
          return new AIMessage(content);
        case "user":
          return new HumanMessage(content);
        default:
          return new HumanMessage(content);
      }
    });

    const last = lc[lc.length - 1];


    const msg = await assistant.invoke({
      input: last.content,
      chat_history: lc
    })

    return {
      id,
      message: {
        role: "assistant",
        content: msg.output
      },
      choices: [
        {
          role: "assistant",
          content: msg.output
        }
      ]
    }
  }).listen(PORT, () => console.log(`Listening on port ${PORT}`))
