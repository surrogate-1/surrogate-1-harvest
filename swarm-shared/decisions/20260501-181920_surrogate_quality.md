# surrogate / quality

### Comprehensive Proposal for Enhancing the Surrogate CLI Help Command

#### Diagnosis
The Surrogate CLI currently suffers from several usability issues that hinder user experience, particularly for newcomers. Key problems include:

1. **Lack of Comprehensive Help Command**: Users cannot easily access detailed information about available commands and options, leading to confusion.
2. **Inconsistent Command Descriptions**: Some commands lack clear descriptions, making it difficult for users to understand their purpose.
3. **Absence of Usage Examples**: Users are not provided with examples of command usage, which can limit their ability to utilize the CLI effectively.
4. **Limited Error Handling**: Feedback for incorrect commands is minimal, resulting in user frustration and confusion.

#### Proposed Change
To address these issues, we propose an overhaul of the help command within the Surrogate CLI. This will involve:

- Creating a comprehensive help system that includes detailed descriptions for each command.
- Adding usage examples to illustrate how commands can be effectively utilized.
- Implementing improved error handling to provide users with clearer feedback when they input incorrect commands.

#### Implementation Steps
1. **Modify the Help Command**:
   - Update the existing help command to include detailed descriptions and usage examples for each command.
   - Use the `argparse` library to structure the help command effectively.

2. **Code Implementation**:
   Below is a synthesized code snippet that incorporates the proposed changes:

```python
import argparse
import sys

def print_help():
    parser = argparse.ArgumentParser(description='Surrogate CLI Help')
    parser.add_argument('command', nargs='?', help='Command to execute')
    parser.add_argument('--auto', help='Plan-driven auto mode')
    parser.add_argument('--status', help='Session + corpus stats')
    parser.add_argument('--init', help='Scaffold SURROGATE.md for this project')
    parser.add_argument('--plan', help='Drive tasks from a markdown checklist')
    
    # Adding detailed descriptions and examples
    parser.add_argument('--help', action='help', help='Show this help message and exit')
    
    help_text = """
    Commands:
      init        Scaffold SURROGATE.md for this project
      plan        Drive tasks from a markdown checklist
      --auto      Plan-driven auto mode
      --status    Show session + corpus stats

    Examples:
      surrogate init                          # Initialize the project
      surrogate --auto                        # Run in auto mode
      surrogate plan set TODO.md              # Set plan from a markdown checklist
    """
    
    print(help_text)
    parser.print_help()

def main():
    if '--help' in sys.argv or len(sys.argv) == 1:
        print_help()
        sys.exit(0)
    
    # Command execution logic
    command = sys.argv[1]
    valid_commands = ['init', 'plan', '--auto', '--status']
    
    if command not in valid_commands:
        print("Error: Invalid command. Use 'surrogate --help' for a list of available commands.")
        sys.exit(1)
    
    # Proceed with command execution...
    # (Implementation of command execution goes here)

if __name__ == '__main__':
    main()
```

3. **Error Handling**:
   - Implement checks for valid commands and provide user-friendly error messages when invalid commands are entered.

#### Verification
To ensure the proposed changes are effective, the following verification steps should be taken:

1. **Run the CLI**: Execute the command `surrogate --help` to confirm that the detailed help text and examples are displayed correctly.
2. **Test Commands**: Validate various commands, including both valid and invalid inputs, to ensure that error handling provides appropriate feedback.
3. **User Feedback**: Gather feedback from users, especially new users, to assess the clarity and usefulness of the help command.

By implementing these changes, the Surrogate CLI will significantly enhance its usability, providing a better experience for both new and experienced users. This comprehensive help command will serve as a valuable resource, reducing confusion and increasing user confidence in utilizing the CLI effectively.
