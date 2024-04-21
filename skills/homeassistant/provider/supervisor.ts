import { Connection } from "home-assistant-js-websocket"
import { HOMEASSISTANT } from "../config"

import {
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
} from "home-assistant-js-websocket/dist/errors.js";
import type { Error } from "home-assistant-js-websocket";
import * as messages from "home-assistant-js-websocket/dist/messages.js";
import { atLeastHaVersion } from "home-assistant-js-websocket/dist/util.js";

const DEBUG = true;

export const MSG_TYPE_AUTH_REQUIRED = "auth_required";
export const MSG_TYPE_AUTH_INVALID = "auth_invalid";
export const MSG_TYPE_AUTH_OK = "auth_ok";

export interface HaWebSocket extends WebSocket {
  haVersion: string;
}

const getWSUrl = () => {
  const url = new URL(HOMEASSISTANT.url)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = '/core/websocket'
  return url.toString()
}

export function createSocket(): Promise<HaWebSocket> {
  // Convert from http:// -> ws://, https:// -> wss://
  const url = getWSUrl();

  if (DEBUG) {
    console.log("[Auth phase] Initializing", url);
  }

  function connect(
    triesLeft: number,
    promResolve: (socket: HaWebSocket) => void,
    promReject: (err: Error) => void,
  ) {
    if (DEBUG) {
      console.log("[Auth phase] New connection", url);
    }

    const socket = new WebSocket(url) as HaWebSocket;

    // If invalid auth, we will not try to reconnect.
    let invalidAuth = false;

    const closeMessage = () => {
      // If we are in error handler make sure close handler doesn't also fire.
      socket.removeEventListener("close", closeMessage);
      if (invalidAuth) {
        promReject(ERR_INVALID_AUTH);
        return;
      }

      // Reject if we no longer have to retry
      if (triesLeft === 0) {
        // We never were connected and will not retry
        promReject(ERR_CANNOT_CONNECT);
        return;
      }

      const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
      // Try again in a second
      setTimeout(() => connect(newTries, promResolve, promReject), 1000);
    };

    // Auth is mandatory, so we can send the auth message right away.
    const handleOpen = async (event: MessageEventInit) => {
      try {
        socket.send(JSON.stringify({
          ...messages.auth(HOMEASSISTANT.token),
          api_password: HOMEASSISTANT.token
        }));
      } catch (err) {
        // Refresh token failed
        invalidAuth = err === ERR_INVALID_AUTH;
        socket.close();
      }
    };

    const handleMessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (DEBUG) {
        console.log("[Auth phase] Received", message);
      }
      switch (message.type) {
        case MSG_TYPE_AUTH_INVALID:
          invalidAuth = true;
          socket.close();
          break;

        case MSG_TYPE_AUTH_OK:
          socket.removeEventListener("open", handleOpen);
          socket.removeEventListener("message", handleMessage);
          socket.removeEventListener("close", closeMessage);
          socket.removeEventListener("error", closeMessage);
          socket.haVersion = message.ha_version;
          if (atLeastHaVersion(socket.haVersion, 2022, 9)) {
            socket.send(JSON.stringify(messages.supportedFeatures()));
          }

          promResolve(socket);
          break;

        default:
          if (DEBUG) {
            // We already send response to this message when socket opens
            if (message.type !== MSG_TYPE_AUTH_REQUIRED) {
              console.warn("[Auth phase] Unhandled message", message);
            }
          }
      }
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", closeMessage);
    socket.addEventListener("error", closeMessage);
  }

  return new Promise((resolve, reject) =>
    connect(3, resolve, reject),
  );
}

export const createConnectionFromHassio = async () => {
  return new Connection(await createSocket(), {
    createSocket,
    setupRetry: 3
  })
}
