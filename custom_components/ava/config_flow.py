"""Config flow for Ava integration."""
from __future__ import annotations

import logging
import types
from types import MappingProxyType
from typing import Any

from openai._exceptions import APIConnectionError, AuthenticationError
import voluptuous as vol
import yaml

from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY, CONF_NAME, DEFAULT_CONF_API_KEY
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.selector import (
    TemplateSelector,
)

from .const import (
    CONF_ATTACH_USERNAME,
    CONF_BASE_URL,
    CONF_PROMPT,
    CONF_SKIP_AUTHENTICATION,
    DEFAULT_ATTACH_USERNAME,
    DEFAULT_CONF_BASE_URL,
    DEFAULT_NAME,
    DEFAULT_PROMPT,
    DEFAULT_SKIP_AUTHENTICATION,
    DOMAIN,
)
from .helpers import validate_authentication

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_NAME): str,
        vol.Optional(CONF_API_KEY, default=DEFAULT_CONF_API_KEY): str,
        vol.Optional(CONF_BASE_URL, default=DEFAULT_CONF_BASE_URL): str,
        vol.Optional(
            CONF_SKIP_AUTHENTICATION, default=DEFAULT_SKIP_AUTHENTICATION
        ): bool,
    }
)

DEFAULT_OPTIONS = types.MappingProxyType(
    {
        CONF_PROMPT: DEFAULT_PROMPT,
        CONF_ATTACH_USERNAME: DEFAULT_ATTACH_USERNAME,
    }
)


async def validate_input(hass: HomeAssistant, data: dict[str, Any]) -> None:
    """Validate the user input allows us to connect.

    Data has the keys from STEP_USER_DATA_SCHEMA with values provided by the user.
    """
    api_key = data[CONF_API_KEY]
    if not api_key:
        return
    base_url = data.get(CONF_BASE_URL)
    skip_authentication = data.get(CONF_SKIP_AUTHENTICATION)

    if base_url == DEFAULT_CONF_BASE_URL:
        # Do not set base_url if using OpenAI for case of OpenAI's base_url change
        base_url = None
        data.pop(CONF_BASE_URL)

    await validate_authentication(
        hass=hass,
        api_key=api_key,
        base_url=base_url,
        skip_authentication=skip_authentication,
    )


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Ava."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user", data_schema=STEP_USER_DATA_SCHEMA
            )

        errors = {}

        try:
            await validate_input(self.hass, user_input)
        except APIConnectionError:
            errors["base"] = "cannot_connect"
        except AuthenticationError:
            errors["base"] = "invalid_auth"
        except Exception:  # pylint: disable=broad-except
            _LOGGER.exception("Unexpected exception")
            errors["base"] = "unknown"
        else:
            return self.async_create_entry(
                title=user_input.get(CONF_NAME, DEFAULT_NAME), data=user_input
            )

        return self.async_show_form(
            step_id="user", data_schema=STEP_USER_DATA_SCHEMA, errors=errors
        )

    @staticmethod
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return OptionsFlow(config_entry)


class OptionsFlow(config_entries.OptionsFlow):
    """OpenAI config flow options handler."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(
                title=user_input.get(CONF_NAME, DEFAULT_NAME), data=user_input
            )
        schema = self.openai_config_option_schema(self.config_entry.options)
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(schema),
        )

    def openai_config_option_schema(self, options: MappingProxyType[str, Any]) -> dict:
        """Return a schema for OpenAI completion options."""
        if not options:
            options = DEFAULT_OPTIONS

        return {
            vol.Optional(
                CONF_PROMPT,
                description={"suggested_value": options[CONF_PROMPT]},
                default=DEFAULT_PROMPT,
            ): TemplateSelector(),
        }
