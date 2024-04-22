import got from "got"
import { version } from "../package.json"

export const http = got.extend({
  headers: {
    "User-Agent": `ava-dynamic-skill/${version}`,
  }
})
