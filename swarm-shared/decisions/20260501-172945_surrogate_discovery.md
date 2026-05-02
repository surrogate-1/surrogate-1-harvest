# surrogate / discovery

# Comprehensive Improvement Proposal for Surrogate CLI

## Diagnosis
The Surrogate CLI currently faces several usability challenges:
1. **Lack of User Guidance**: There is no help command or comprehensive documentation, making it difficult for users to understand available commands and their usage.
2. **No Command Aliases**: The only alias available is `sg`, which limits usability and memorability for users.
3. **Limited Error Handling**: The CLI does not provide clear, informative error messages for incorrect commands or usage, leading to user frustration.
4. **Inconsistent Output**: Command outputs do not follow a standard format, complicating the parsing of results.
5. **Missing Dependency Validation**: The installation script does not check for necessary dependencies, which can lead to installation failures.
6. **Outdated Project Documentation**: The `SURROGATE.md` file is not automatically updated, risking the provision of outdated information.
7. **Lack of Discovery Mechanism**: Users cannot easily discover the CLI's capabilities or the current state of the project.

## Proposed Changes
To address these issues, the following actionable changes are proposed:

1. **Implement a Help Command**: Introduce a `--help` or `-h` option that displays a list of commands, their descriptions, and usage examples.
2. **Introduce Command Aliases**: Create additional aliases for common commands to enhance usability.
3. **Enhance Error Handling**: Implement robust error handling that provides user-friendly messages for invalid commands or parameters.
4. **Standardize Output Format**: Define a consistent output format for all commands to improve readability.
5. **Validate Dependencies**: Modify the `install.sh` script to check for required dependencies (e.g., Python 3.9+, curl) before installation.
6. **Automate Documentation Updates**: Ensure that the `SURROGATE.md` file is automatically generated or updated when the project is initialized or when new tasks are added.
7. **Add a Discovery Flag**: Introduce a `--discover` flag that provides information about the project's focus and current state.

## Implementation Steps
1. **Help Command**:
   - Implement a function to display help information.
   - Update the command registration section to include this functionality.

2. **Command Aliases**:
   - Define additional aliases for frequently used commands.

3. **Error Handling**:
   - Wrap command execution in try-except blocks to catch exceptions and provide informative messages.

4. **Output Standardization**:
   - Create a function to format outputs consistently across all commands.

5. **Dependency Validation**:
   - Modify the `install.sh` script to check for necessary dependencies before proceeding with the installation.

6. **Documentation Automation**:
   - Implement a mechanism to update `SURROGATE.md` automatically based on the current project state and tasks.

7. **Discovery Flag**:
   - Use the `argparse` library to implement the `--discover` flag, which will print the project's focus and state.

### Example Code Snippet
Here’s a simplified example of how the implementation might look:

```python
# main.py (or equivalent)

import sys

def display_help():
    help_text = """
    Usage: surrogate [options] [command]

    Commands:
      init                   Scaffold SURROGATE.md for this project
      plan set <file>        Drive tasks from a markdown checklist
      plan show              Show plan progress
      --auto                 Plan-driven auto mode
      --status               Session + corpus stats
      -h, --help             Show this help message
      --discover             Show project discovery focus and current state
    """
    print(help_text)

def validate_dependencies():
    # Check for required dependencies
    pass  # Implementation of dependency checks

def main():
    validate_dependencies()

    if len(sys.argv) < 2:
        print("Error: No command provided. Use --help for usage.")
        return

    command = sys.argv[1]

    if command in ['--help', '-h']:
        display_help()
        return
    elif command == '--discover':
        print("Discovery focus: Improve user interaction and command usability.")
        print("Current state: Basic functionality with limited error handling.")
        return

    # Example of command execution with error handling
    try:
        if command == 'init':
            # Call init function
            pass
        elif command == 'plan':
            # Handle plan commands
            pass
        else:
            print(f"Error: Unknown command '{command}'. Use --help for usage.")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
```

## Verification
To ensure the proposed changes are effective, the following verification steps should be taken:
1. **Help Command**: Execute `surrogate --help` to confirm the help text displays correctly.
2. **Command Aliases**: Verify that aliases function as expected (e.g., `sg init` works as `surrogate init`).
3. **Error Handling**: Run invalid commands to check if user-friendly error messages are displayed.
4. **Output Consistency**: Execute multiple commands to ensure consistent output formatting.
5. **Dependency Validation**: Test the installation script to confirm it checks for necessary dependencies.
6. **Documentation Updates**: Ensure that `SURROGATE.md` is updated correctly when the project is initialized or modified.
7. **Discovery Flag**: Run `surrogate --discover` to verify that it correctly displays the project's focus and state.

By implementing these changes, the Surrogate CLI will become significantly more user-friendly, intuitive, and robust, ultimately enhancing the overall user experience.
