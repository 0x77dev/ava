#!/usr/bin/env bashio

LLM="$(bashio::config 'llm' | jq -r .llm)"
EMBEDDINGS="$(bashio::config 'embeddings' | jq -r .llm)"
HOMEASSISTANT='{"url": "ws://supervisor/core/websocket", "token": "${SUPERVISOR_TOKEN}"}'

bun run /usr/src/app/server/src/index.ts
