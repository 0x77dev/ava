import { Auth, createConnection, createLongLivedTokenAuth } from "home-assistant-js-websocket";
import { HOMEASSISTANT } from "./config";

const auth = createLongLivedTokenAuth(
  HOMEASSISTANT.url,
  HOMEASSISTANT.token
);

export const hass = await createConnection({
  auth,
  createSocket(options) {
    if (options.auth && new URL(HOMEASSISTANT.url).hostname === "supervisor") {
      options.auth = {
        data: {
          ...options.auth.data,
          hassUrl: "http://supervisor/core"
        },
        wsUrl: "ws://supervisor/core/websocket",
        accessToken: HOMEASSISTANT.token,
        async refreshAccessToken() {},
        expired: false,
        async revoke() {}
      }
    }
    return options.createSocket(options)
  },
});
