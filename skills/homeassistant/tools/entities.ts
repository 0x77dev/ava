import { DynamicTool, HNSWLib, Document, createEmbeddings, formatToolAnswer } from "@ava/lang";
import { entitiesColl, type HassEntities } from "home-assistant-js-websocket";
import { hass } from "../provider";
import { HOMEASSISTANT } from "../config";

interface Searchable {
  text: string
  lastChanged: string
  embedding: number[]
}

const entitiesToSearchable = async (entities: HassEntities, embeddings: Awaited<ReturnType<typeof createEmbeddings>>): Promise<Record<string, Searchable>> => {
  const entries = Object.entries(entities)

  return Object.fromEntries(await Promise.all(entries.map(async ([entityId, entity]): Promise<[string, Searchable]> => {
    const data = {
      entityId,
      state: entity.state,
      attributes: entity.attributes,
      lastChanged: entity.last_changed,
      lastUpdated: entity.last_updated,
    }
    const text = formatToolAnswer(data)

    return [entityId, {
      text,
      lastChanged: entity.last_changed,
      embedding: await embeddings.embedQuery(text),
    }]
  })))
}

const createStore = async () => {
  const embeddings = await createEmbeddings()
  const coll = entitiesColl(hass)
  let store = new HNSWLib(embeddings, {
    space: 'cosine'
  })

  let entityToSearchable: Record<string, Searchable> = {}

  coll.subscribe(async (entities) => {
    const updatedSince = Object.fromEntries(
      Object.entries(entities)
        .filter(([entityId, { last_changed }]) => {
          if (HOMEASSISTANT.disabledEntitiesPrefixes.some((disabled) => entityId.startsWith(disabled))) {
            return false
          }

          return last_changed !== entityToSearchable[entityId]?.lastChanged
        })
    )

    if (!Object.keys(updatedSince).length) {
      return
    }

    entityToSearchable = { ...entityToSearchable, ...await entitiesToSearchable(updatedSince, embeddings) }
    store = new HNSWLib(embeddings, {
      space: 'cosine'
    })

    const vectors = Object.values(entityToSearchable).map(({ embedding }) => embedding)
    const docs = Object.entries(entityToSearchable).map(([entityId, searchable]) => {
      return new Document({
        pageContent: searchable.text,
        metadata: {
          entityId,
        }
      })
    })

    await store.addVectors(vectors, docs)

    console.log('updated entities store with', Object.keys(updatedSince).length, 'updates, index size now is:', Object.keys(entityToSearchable).length)
  })

  try {
    await coll.refresh()
  } catch (error) {
    console.warn(error)
  }

  return async (query: string) => {
    console.log('[ha] searching for', query)

    const results = await store.similaritySearchWithScore(query, 5)

    return results.map(([{ pageContent, metadata }, score]) => {
      console.log('found', metadata.entityId, 'for', query, 'with score', score)
      return pageContent
    })
  }
}

export const entities = async () => {
  const getStore = await createStore()

  return new DynamicTool({
    name: 'get-homeassistant-entities',
    description: 'Get entities from Home Assistant, input will filter the entities using natural language',
    async func(input) {
      const results = await getStore(input)

      return results.join('\n')
    },
  })
}
