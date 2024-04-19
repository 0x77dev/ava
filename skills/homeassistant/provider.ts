import { Auth, createConnection } from "home-assistant-js-websocket";
import { HOMEASSISTANT } from "./config";

export const hass = await createConnection({
  auth: new Auth({
    access_token: HOMEASSISTANT.token,
    hassUrl: HOMEASSISTANT.url,
    clientId: '',
    expires: Infinity,
    expires_in: Infinity,
    refresh_token: '',
  })
});
