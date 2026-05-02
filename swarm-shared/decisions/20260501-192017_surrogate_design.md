# surrogate / design

### Diagnosis
* The Surrogate CLI lacks a comprehensive help command, making it difficult for users to access detailed information about available commands and options.
* The current help output is limited and does not provide sufficient information about the usage of each command.
* The Surrogate CLI does not have a unified way of handling help requests, leading to inconsistent user experience.
* The documentation is not easily accessible from the command line, requiring users to visit the GitHub page or read the README file.
* The help command does not provide examples or usage scenarios, making it harder for new users to get started with the Surrogate CLI.

### Proposed change
The proposed change is to implement a comprehensive help command that provides detailed information about available commands and options. This will involve modifying the `surrogate` script to include a help function that displays detailed information about each command.

The scope of the change will be limited to the `surrogate` script, specifically the `__main__.py` file, which is the entry point of the Surrogate CLI.

### Implementation
To implement the comprehensive help command, we will use the `argparse` library to define a help function that displays detailed information about each command.

Here is an example of how the `__main__.py` file could be modified:
```python
import argparse

def main():
    parser = argparse.ArgumentParser(description='Surrogate CLI')
    subparsers = parser.add_subparsers(dest='command')

    # Define help command
    help_parser = subparsers.add_parser('help', help='Display detailed help information')
    help_parser.add_argument('--command', help='Specify a command to display help for')

    # Define other commands
    # ...

    args = parser.parse_args()

    if args.command == 'help':
        if args.command:
            # Display help for a specific command
            print(f"Help for command '{args.command}':")
            # Add help text for each command here
        else:
            # Display general help information
            print("Surrogate CLI Help")
            print("--------------------")
            print("Available commands:")
            # Add list of available commands here
    else:
        # Handle other commands
        # ...

if __name__ == '__main__':
    main()
```
To add detailed help information for each command, we can modify the `help_parser` to include a dictionary that maps each command to its help text.

For example:
```python
help_text = {
    'init': 'Initialize a new Surrogate project',
    'plan': 'Manage Surrogate plans',
    'status': 'Display Surrogate session and corpus stats',
    # Add help text for each command here
}

# ...

if args.command == 'help':
    if args.command:
        # Display help for a specific command
        print(f"Help for command '{args.command}':")
        print(help_text.get(args.command, 'No help available for this command'))
    else:
        # Display general help information
        print("Surrogate CLI Help")
        print("--------------------")
        print("Available commands:")
        for command, text in help_text.items():
            print(f"  {command}: {text}")
```
### Verification
To verify that the comprehensive help command works as expected, we can run the following tests:

* Run `surrogate help` to display general help information
* Run `surrogate help --command init` to display help for the `init` command
* Run `surrogate help --command plan` to display help for the `plan` command
* Run `surrogate help --command status` to display help for the `status` command

We can also test that the help command displays the correct information for each command by comparing the output to the expected help text.
