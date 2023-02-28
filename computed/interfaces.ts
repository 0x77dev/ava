import type { Example } from '../gpt3/instructions'

export interface VMOptions {
  input: string
  id?: string | number
  context?: Record<string, any>
}

export interface Entity {
  match: string
  original: string
  vm: VMOptions
  result?: string
}

export interface Rendered {
  input: string
  entities: Entity[]
  output: string
}

export interface VMModule {
  id: string
  gpt3?: {
    context?: string[]
    examples?: Example[]
  }
  vm: {
    context: Record<string, any>
  }
}
