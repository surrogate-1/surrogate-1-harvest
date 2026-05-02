# surrogate / backend

### Comprehensive Proposal for Enhancing the Surrogate CLI Help Command

#### Diagnosis
The Surrogate CLI currently faces several usability challenges:
1. **Lack of Comprehensive Help Command**: Users struggle to understand available commands and options due to the absence of a built-in help command.
2. **Insufficient Documentation**: The existing README file does not adequately replace the need for a detailed help system within the CLI.
3. **Error Handling**: There is no consistent mechanism to handle unknown or invalid commands, leading to user confusion.
4. **Inadequate API Key Management Guidance**: Users find it difficult to obtain and configure required API keys due to poor documentation.

#### Proposed Changes
To address these issues, we propose the following enhancements to the Surrogate CLI:

1. **Implement a Comprehensive Help Command**: 
   - Introduce a `--help` option that provides detailed information about available commands, their usage, parameters, and examples.
   - Ensure that the help command is accessible from any point in the CLI, including specific commands (e.g., `surrogate init --help`).

2. **Enhance Error Handling**:
   - Implement a consistent error handling mechanism that provides clear, actionable error messages for invalid commands or options.

3. **Improve Documentation**:
   - Update the README file to include a section that directs users to the help command for detailed command usage and options.
   - Provide clear instructions on API key management within the help command.

#### Implementation
The implementation will involve modifying the `surrogate` script located at `/opt/axentx/surrogate/surrogate`. Below is a code snippet demonstrating the proposed changes:

```python
import argparse
import sys

# Define a dictionary to store command information
commands = {
    'init': {'usage': 'surrogate init', 'description': 'Scaffold SURROGATE.md for this project'},
    'plan': {'usage': 'surrogate plan <command>', 'description': 'Drive tasks from a markdown checklist'},
    'status': {'usage': 'surrogate --status', 'description': 'Session + corpus stats'}
}

def display_help():
    """Display detailed information about available commands and options."""
    print("Surrogate CLI Help")
    print("-------------------")
    print("Available commands:")
    for command, info in commands.items():
        print(f"  {info['usage']}: {info['description']}")
    print("\nOptions:")
    print("  --help       Display this help message")
    print("  --auto       Run in auto mode")
    print("  --prefix     Specify a custom install prefix")
    print("  --uninstall  Uninstall Surrogate")
    # Add more options as necessary

def main():
    parser = argparse.ArgumentParser(description='Surrogate CLI')
    parser.add_argument('--help', action='store_true', help='Display help information')
    args = parser.parse_args()

    if args.help:
        display_help()
        sys.exit(0)

    # Handle other commands here
    # Example: if command is not recognized, show an error message
    print("Error: Unrecognized command. Use --help for a list of available commands.")

if __name__ == '__main__':
    main()
```

#### Verification
To ensure the changes are effective:
1. **Run the Help Command**: Execute `surrogate --help` and verify that the output includes detailed information about commands and options.
2. **Test Specific Command Help**: Execute commands like `surrogate init --help` to ensure they provide relevant help information.
3. **Check Error Handling**: Test the CLI with invalid commands to confirm that meaningful error messages are displayed.
4. **Review Documentation**: Update the README to reference the new help command and ensure it is clear and concise.

By implementing these changes, the Surrogate CLI will become significantly more user-friendly, providing clear guidance and improving the overall user experience.
