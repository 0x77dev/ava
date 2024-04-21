import { Ollama } from "ollama"

export const createOllama = (baseURL?: string) => {
  return new Ollama({
    host: baseURL,
  })
}

export const pullModel = async (model: string, baseURL?: string) => {
  const ollama = createOllama(baseURL)
  const events = await ollama.pull({
    model,
    stream: true
  })

  for await (const event of events) {
    console.log('[ollama] pulling', model, event)
  }
}
