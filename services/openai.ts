import { config } from './config'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration(config.openai)
export const openai = new OpenAIApi(configuration)
