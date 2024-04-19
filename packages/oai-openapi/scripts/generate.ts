import { $, write } from 'bun'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

const tmpDir = join(tmpdir(), '@ava/oai-openapi')
await mkdir(tmpDir, { recursive: true })
const cwd = join(__dirname, '../generated')
await mkdir(cwd, { recursive: true })
const res = await fetch('https://raw.githubusercontent.com/openai/openai-openapi/2.0.0/openapi.yaml')
const def = await res.text()
const dest = join(tmpDir, 'openapi.yaml')
await write(dest, def)
console.log(cwd, dest)
await $`openapi --input ${dest} --output ${cwd}`
