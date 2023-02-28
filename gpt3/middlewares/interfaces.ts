import type { Instructions } from '../instructions'

export interface Middleware {
  id: string
  before?: (input: string) => Promise<string> | string
  after?: (input: string) => Promise<string> | string
  gpt3?: Partial<Instructions>
}
