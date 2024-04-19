import { Elysia } from 'elysia'
import { swagger } from './services/swagger'
import { autoload } from "elysia-autoload"
import { PORT } from './services/config'
import { elysiaLogger } from './services/logger'
import { getAssistant } from './services/assistant'

const assistant = await getAssistant()
console.log('Assistant initialized', assistant.getName())

const app = new Elysia()
.use(swagger)
.use(elysiaLogger)
.use(autoload())
  .listen(PORT, (server) => {
    console.log(`listening on http://${server.hostname}:${server.port}`)
  })

export type ElysiaApp = typeof app
