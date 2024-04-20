import { exists, readFile } from 'fs/promises'

const OPTIONS_PATH = '/data/options.json'

export const injectHassOptions = async () => {
  const isHass = await exists(OPTIONS_PATH)
  if (!isHass) {
    return
  }

  const raw  = await readFile(OPTIONS_PATH, 'utf8')
  const options = JSON.parse(raw)

  if (options.llm) {
    process.env.LLM = JSON.stringify(options.llm)
  }

  if (options.embeddings) {
    process.env.EMBEDDINGS = JSON.stringify(options.embeddings)
  }

  process.env.HOMEASSISTANT = JSON.stringify({
    "token": process.env.SUPERVISOR_TOKEN,
    "url": "ws://supervisor/core/websocket",
  })
}
