import {
  createConnection,
  createLongLivedTokenAuth,
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  ERR_CONNECTION_LOST,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_HTTPS_TO_HTTP,
  ERR_INVALID_AUTH_CALLBACK,
} from "home-assistant-js-websocket";
import { HOMEASSISTANT } from "../config";
import { createConnectionFromHassio } from "./supervisor";

const errorMap: Record<number, string> = {
  [ERR_CANNOT_CONNECT]: "ERR_CANNOT_CONNECT",
  [ERR_INVALID_AUTH]: "ERR_INVALID_AUTH",
  [ERR_CONNECTION_LOST]: "ERR_CONNECTION_LOST",
  [ERR_HASS_HOST_REQUIRED]: "ERR_HASS_HOST_REQUIRED",
  [ERR_INVALID_HTTPS_TO_HTTP]: "ERR_INVALID_HTTPS_TO_HTTP",
  [ERR_INVALID_AUTH_CALLBACK]: "ERR_INVALID_AUTH_CALLBACK",
}

const createHass = async () => {
  try {
    return HOMEASSISTANT.supervisor ?
      await createConnectionFromHassio() :
      await createConnection({
        auth: createLongLivedTokenAuth(HOMEASSISTANT.url, HOMEASSISTANT.token)
      })
  } catch (error: any) {
    if (typeof error === "number") {
      console.error(errorMap[error])
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

export const hass = await createHass()
