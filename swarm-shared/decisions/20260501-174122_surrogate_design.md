# surrogate / design

### Comprehensive Proposal for Enhancing the Surrogate CLI

#### Diagnosis
The Surrogate CLI currently faces several usability challenges:
1. **Lack of Comprehensive Help Command**: Users struggle to understand available commands and options due to the absence of a detailed help command.
2. **Inadequate Documentation**: The existing README file does not sufficiently cover usage instructions, leading to confusion, especially for new users.
3. **Installation Guidance**: The installation process is poorly documented, making it difficult for users to set up the CLI.
4. **Insufficient Feedback on API Keys and Environment Variables**: Users receive no guidance on how to utilize API keys and environment variables effectively.
5. **Limited Error Handling**: The CLI does not provide clear feedback when invalid commands are entered, which can hinder troubleshooting.

#### Proposed Changes
To address these issues, we propose the following enhancements:

1. **Implement a Comprehensive Help Command**:
   - Introduce a `--help` option that provides a detailed overview of available commands, options, and usage examples.
   - Use the `argparse` library to facilitate command-line argument parsing and help message generation.

2. **Update Documentation**:
   - Revise the README file to include clear instructions on installation, usage, and the purpose of the `SURROGATE.md` file.
   - Provide examples of how to use the CLI effectively, including how to manage API keys and environment variables.

3. **Improve Error Handling**:
   - Implement user-friendly error messages that guide users when they enter invalid commands.
   - Include suggestions for obtaining help when errors occur.

#### Implementation Steps
1. **Modify the Surrogate Script**:
   - Update the `surrogate` script located at `/opt/axentx/surrogate/surrogate` to include the following code:

```python
import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description='Surrogate CLI AI assistant')
    parser.add_argument('--help', action='help', help='Show this help message and exit')
    parser.add_argument('--auto', action='store_true', help='Run in plan-driven auto mode')
    parser.add_argument('--status', action='store_true', help='Show session and corpus statistics')
    parser.add_argument('command', nargs='?', help='Command to execute')

    args = parser.parse_args()

    if args.command is None:
        print('Usage: surrogate [command] [options]')
        print('Type "surrogate --help" for more information')
        sys.exit(0)

    # Implement command handling here
    # ...

if __name__ == '__main__':
    main()
```

2. **Update the README File**:
   - Revise the README to include:
     - Installation instructions.
     - A section detailing the CLI commands, including examples.
     - Guidance on using the `SURROGATE.md` file effectively.

3. **Testing and Verification**:
   - Test the new `--help` command:
     - Run `surrogate --help` to ensure it displays a comprehensive help message.
     - Run `surrogate` without arguments to verify it prompts for help.
     - Test invalid commands to confirm that appropriate error messages are displayed.
   - Ensure that all documentation is consistent with the new features and provides clear guidance.

#### Conclusion
By implementing a comprehensive help command, enhancing documentation, and improving error handling, we can significantly enhance the user experience of the Surrogate CLI. These changes will make the CLI more accessible, especially for new users, and will provide the necessary support to navigate its functionalities effectively.
