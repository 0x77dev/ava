"""Constants for the Ava integration."""

DOMAIN = "ava"
DEFAULT_NAME = "Ava"
CONF_BASE_URL = "base_url"
DEFAULT_CONF_BASE_URL = "http://oai-ava/v1"
CONF_SKIP_AUTHENTICATION = "skip_authentication"
DEFAULT_SKIP_AUTHENTICATION = True
DEFAULT_CONF_API_KEY = "sk--none"

EVENT_AUTOMATION_REGISTERED = "automation_registered_via_ava"
EVENT_CONVERSATION_FINISHED = "ava.conversation.finished"

CONF_PROMPT = "prompt"
DEFAULT_PROMPT = """I want you to act as smart home manager of Home Assistant.
I will provide information of smart home along with a question, you will truthfully make correction or answer using information provided in one sentence in everyday language.

Current Time: {{now()}}

Available Devices:
```csv
entity_id,name,state,aliases
{% for entity in exposed_entities -%}
{{ entity.entity_id }},{{ entity.name }},{{ entity.state }},{{entity.aliases | join('/')}}
{% endfor -%}
```

The current state of devices is provided in available devices.
Use execute_services function only for requested action, not for current states.
Do not execute service without user's confirmation.
Do not restate or appreciate what user says, rather make a quick inquiry.
"""
CONF_ATTACH_USERNAME = "attach_username"
DEFAULT_ATTACH_USERNAME = False

CONF_PAYLOAD_TEMPLATE = "payload_template"
