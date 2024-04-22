import { Document, DynamicStructuredTool, DynamicTool, HNSWLib, createEmbeddings, formatToolAnswer } from "@ava/lang";
import { servicesColl, type HassServices } from "home-assistant-js-websocket";
import { hass } from "../provider";
import { z } from "zod";
import { callService } from "home-assistant-js-websocket";

interface Searchable {
  text: string
  embedding: number[]
}

const servicesToSearchable = async (services: HassServices, embeddings: Awaited<ReturnType<typeof createEmbeddings>>): Promise<Record<string, Searchable>> => {
  const entries = Object.entries(services)

  return Object.fromEntries(await Promise.all(entries.map(async ([serviceId, service]): Promise<[string, Searchable]> => {
    const text = formatToolAnswer(service)

    return [serviceId, {
      text,
      embedding: await embeddings.embedQuery(text),
    }]
  })))
}

const createStore = async () => {
  const embeddings = await createEmbeddings()
  const coll = servicesColl(hass)
  let store = new HNSWLib(embeddings, {
    space: 'cosine'
  })

  let serviceToSearchable: Record<string, Searchable> = {}

  coll.subscribe(async (services) => {
    serviceToSearchable = { ...serviceToSearchable, ...await servicesToSearchable(services, embeddings) }
    store = new HNSWLib(embeddings, {
      space: 'cosine'
    })

    const vectors = Object.values(servicesToSearchable).map(({ embedding }) => embedding)
    const docs = Object.entries(servicesToSearchable).map(([entityId, searchable]) => {
      return new Document({
        pageContent: searchable.text,
        metadata: {
          entityId,
        }
      })
    })

    await store.addVectors(vectors, docs)

    console.log('updated services store with', Object.keys(servicesToSearchable).length)
  })

  try {
    await coll.refresh()
  } catch (error) {
    console.warn(error)
  }

  return async (query: string) => {
    console.log('searching for', query)

    const results = await store.similaritySearchWithScore(query, 5)

    return results.map(([{ pageContent, metadata }, score]) => {
      console.log('found', metadata.entityId, 'for', query, 'with score', score)
      return pageContent
    })
  }
}

export const services = async () => {
  const getStore = await createStore()

  return new DynamicTool({
    name: 'get-homeassistant-services',
    description: 'Get services from Home Assistant, input will filter the services using natural language',
    async func(input) {
      const results = await getStore(input)

      return results.join('\n')
    },
  })
}

export const call = () => {
  return new DynamicStructuredTool({
    name: 'call-homeassistant-service',
    description: 'Call a service in Home Assistant',
    schema: z.object({
      domain: z.string(),
      service: z.string(),
      data: z.any({}),
      target: z.optional(z.any({})),
    }),
    async func(input) {
      const { domain, service, data, target } = input
      const res = await callService(hass, domain, service, data, target)

      return `success: ${formatToolAnswer(res as any)}`
    }
  })
}
