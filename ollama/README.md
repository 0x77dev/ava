---
title: Ollama
description: The easiest way to get up and running with large language models locally
---

[![Open Home Assistant instance and add repository](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https://github.com/0x77dev/ava)

Models are stored in `/config/ollama`.

Utilize the `OLLAMA_HOST="http://homeassistant.local:11434"` environment variable to use Ollama CLI on another machine.

Refer to the [Ollama documentation](https://github.com/ollama/ollama/tree/main/docs) for further details..

Example for pulling models:

Using Ollama CLI:
```bash
export OLLAMA_HOST="http://homeassistant.local:11434"
ollama pull nomic-text-embed
```

Using curl:
```bash
curl http://homeassistant.local:11434/api/pull -d '{
  "name": "nomic-text-embed"
}'
```

[Ava Server](/addons/server) will automatically pull models on start when they are requested from Ollama.
