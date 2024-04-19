"""The exceptions used by Ava."""
from homeassistant.exceptions import HomeAssistantError

class NativeNotFound(HomeAssistantError):
    """When native function not found."""

    def __init__(self, name: str) -> None:
        """Initialize error."""
        super().__init__(self, f"native function '{name}' does not exist")
        self.name = name

    def __str__(self) -> str:
        """Return string representation."""
        return f"native function '{self.name}' does not exist"

class ParseArgumentsFailed(HomeAssistantError):
    """When parse arguments failed."""

    def __init__(self, arguments: str) -> None:
        """Initialize error."""
        super().__init__(
            self,
            f"failed to parse arguments `{arguments}`. Increase maximum token to avoid the issue.",
        )
        self.arguments = arguments

    def __str__(self) -> str:
        """Return string representation."""
        return f"failed to parse arguments `{self.arguments}`. Increase maximum token to avoid the issue."
