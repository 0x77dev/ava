# Ollama add-on for Home Assistant
This is the Ollama add-on for Home Assistant.

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
