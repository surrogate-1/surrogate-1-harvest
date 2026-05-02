# surrogate / frontend

**Synthesized Improvement Proposal for Surrogate CLI Help Command**

## Diagnosis
The Surrogate CLI faces several usability challenges, including:

1. **Lack of Comprehensive Help Command**: Users cannot access detailed information about available commands and options.
2. **User Confusion**: New users struggle to get started without clear guidance on using the CLI effectively.
3. **Limited Documentation**: The README lacks a structured overview of commands, leading to confusion.
4. **Inconsistent User Experience**: Without a help command, users may feel lost or frustrated when trying to use the CLI.
5. **Limited Discoverability**: Users may not realize the full capabilities of the CLI without a help command.

## Proposed Change
Implement a comprehensive `--help` command that provides users with a detailed overview of commands and options. This will involve:

* Creating a new function in the main CLI file (e.g., `src/cli.py` or similar) to handle the help command.
* Updating the command routing to include a `--help` or `-h` option.

## Implementation
1. **Open the main CLI file** (e.g., `src/cli.py`).
2. **Add a new function** to handle the help command:
```python
def show_help():
    help_text = """
    Usage: surrogate [OPTIONS] [COMMAND]
    Options:
    -h, --help     Show this help message and exit.
    --auto         Plan-driven auto mode.
    --status       Show session and corpus stats.
    Commands:
    init           Scaffold SURROGATE.md for this project.
    plan set <file> Drive tasks from a markdown checklist.
    plan show       Show plan progress (✅/⏳).
    <other commands> <description of other commands>
    For more information, visit the documentation at <link to documentation>.
    """
    print(help_text)
```
3. **Update the command routing** to call `show_help()` when the help option is detected:
```python
import sys

def main():
    if '--help' in sys.argv or '-h' in sys.argv:
        show_help()
        return
    # Existing command handling logic...
```
4. **Ensure the new function is integrated** with the existing command structure.

## Verification
To confirm the implementation works:

1. **Run the CLI with the help option**: `surrogate --help` or `surrogate -h`
2. **Check the output** to ensure it displays the comprehensive help text as expected.
3. **Test other commands** to ensure they still function correctly and the help command does not interfere with existing functionality.
4. **Gather feedback from users** to see if the help command improves their experience and understanding of the CLI.

By implementing this change, users will have immediate access to essential information about the CLI, improving their overall experience and reducing confusion. The help command will provide a clear and concise overview of available commands and options, making it easier for new users to get started and for existing users to discover the full capabilities of the CLI.
