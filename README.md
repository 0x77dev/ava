# Ava
Self-hosted personal assistant in minutes with built-in Home Assistant integration and great extensibility and customizability.

Documentation is available on project website: https://ava.0x77.dev

![GitHub License](https://img.shields.io/github/license/0x77dev/ava)
![Maintenance](https://img.shields.io/maintenance/yes/2024)
![GitHub last commit](https://img.shields.io/github/last-commit/0x77dev/ava)
[![Ship Docker Image](https://github.com/0x77dev/ava/actions/workflows/docker-image.yaml/badge.svg)](https://github.com/0x77dev/ava/actions/workflows/docker-image.yaml)


## Features

- **Supports almost all major LLMs**: Support for OpenAI, Anthropic, and Ollama out of the box.
- **Home Assistant Integration**: Ava can control your Home Assistant devices and answer questions about your entities.
- **Extensible _(work in progress)_**: Ava is built with extensibility in mind. You can easily add new skills using custom HTTP endpoints.
- **Customizable**: Great level of customizability with almost everything being configurable using environment variables.
- **Fully private**: Ava is self-hosted, so you have full control over your data.
- **OpenAI compatible endpoints**: Chat with your Ava using OpenAI compatible chat completion endpoint.
- **Home Assistant addons**: Install Ava and Ollama as a Home Assistant addons with a couple of clicks.
- **Dockerized**: Ava is available as a Docker image for both amd64 and aarch64, so you can manually spin it up in minutes.

## Home Assistant Installation

### Addons Repository

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https://github.com/0x77dev/ava)

- [**Ollama**](./ollama): The easiest way to get up and running with large language models locally
- [**Ava Server**](./server)

Learn more about configuring the addons on the [project website](https://ava.0x77.dev).

### Custom component

#### HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=0x77dev&repository=ava&category=integration)

#### Manual

Copy the [`custom_components/ava`](./custom_components/ava) folder to your `/config/custom_components` Home Assistant folder.

You can download the custom component zip directly using [GitZip](https://kinolien.github.io/gitzip/?download=https://github.com/0x77dev/ava/tree/main/custom_components/ava).

Learn more about configuring the custom component on the [project website](https://ava.0x77.dev).


