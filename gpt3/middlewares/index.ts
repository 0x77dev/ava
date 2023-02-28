import type { Middleware } from './interfaces'

// TODO: deduplication of middlewares using id

export const runBefore = async (
  input: string,
  middlewares: Middleware[]
): Promise<string> => {
  for (const middleware of middlewares) {
    if (!middleware.before) continue
    input = await middleware.before(input)
  }

  return input
}

export const runAfter = async (
  input: string,
  middlewares: Middleware[]
): Promise<string> => {
  for (const middleware of middlewares) {
    if (!middleware.after) continue
    input = await middleware.after(input)
  }

  return input
}
