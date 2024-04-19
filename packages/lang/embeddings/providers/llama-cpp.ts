import EasyDl from "easydl";
import type { Embeddings } from "../schema";
import { exists, mkdir } from "fs/promises";
import { cpus } from "os";
import { LlamaCppEmbeddings } from "langchain/embeddings/llama_cpp";

export const llamaCpp = async (embeddings: Embeddings) => {
  if (!embeddings.baseURL) {
    throw new Error("Missing baseURL in embeddings configuration for llama-cpp, it should point using file:// on where to store the model");
  }

  const location = new URL(embeddings.baseURL);
  if (location.protocol !== "file:") {
    throw new Error("baseURL for llama-cpp should be a file:// URL");
  }

  const dir = location.pathname.split("/").slice(0, -1).join("/");
  await mkdir(dir, { recursive: true });

  const download = new URL(embeddings.name);
  if (download.protocol !== "https:") {
    throw new Error("name for llama-cpp should be an http(s):// URL pointing to the GGUF file");
  }

  const downloaded = await exists(location.pathname)
  if (!downloaded) {
    console.log("Downloading model, this may take a while", download.href, 'to', location.pathname)
    await new EasyDl(
      download.href,
      location.pathname,
      { connections: cpus().length, maxRetry: 5 }
    ).wait();
  }

  const embed = new LlamaCppEmbeddings({
    modelPath: location.pathname,
    maxConcurrency: cpus().length,
    embedding: true,
    threads: cpus().length,
    contextSize: embeddings.extra?.contextSize,
    batchSize: embeddings.extra?.batchSize
  })

  console.debug("Loaded LlamaCppEmbeddings", embeddings.name, embeddings.baseURL)
  console.debug("sample run", await embed.embedQuery("Hello, world!"))

  return embed
}