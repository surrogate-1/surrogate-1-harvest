# surrogate / quality

### Synthesized Solution

The Surrogate CLI lacks a comprehensive help command, making it difficult for users to access detailed information about available commands and options. To address this issue, we will implement a comprehensive help system that provides detailed information about each command and option.

#### Proposed Change

The proposed change is to enhance the `surrogate` command with a comprehensive help system. This will involve modifying the `surrogate` script to include detailed help messages for each command and option.

#### Implementation

To implement this change, we will:

1. Modify the `surrogate` script to include a `--help` option that displays a detailed help message.
2. Add help messages for each command and option, including examples and explanations.
3. Improve the error handling in the `install.sh` script and other commands to provide more informative error messages.

Here is an example of how the `surrogate` script could be modified to include a comprehensive help system:
```python
import argparse

def main():
    parser = argparse.ArgumentParser(description='Surrogate CLI AI assistant')
    parser.add_argument('--help', '-h', action='help', help='Show this help message and exit')
    parser.add_argument('command', nargs='?', help='Command to execute')
    parser.add_argument('--auto', action='store_true', help='Run in auto mode')
    parser.add_argument('--status', action='store_true', help='Display session and corpus stats')

    args = parser.parse_args()

    if args.command == 'init':
        # scaffold SURROGATE.md for this project
        pass
    elif args.command == 'plan':
        # drive tasks from a markdown checklist
        pass
    elif args.command == 'status':
        # session + corpus stats
        pass
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
```
We will also modify the `install.sh` script to include a more detailed help message:
```bash
#!/bin/bash

print_help() {
    echo "Usage: surrogate [options] [command]"
    echo ""
    echo "Options:"
    echo "  -h, --help      Show this help message and exit"
    echo "  --auto          Plan-driven auto mode"
    echo "  --status        Session + corpus stats"
    echo ""
    echo "Commands:"
    echo "  init            Scaffold SURROGATE.md for this project"
    echo "  plan set <file>  Drive tasks from a markdown checklist"
    echo "  plan show        Show plan progress"
}

if [ "$1" = "--help" ]; then
    print_help
    exit 0
fi
```
#### Verification

To verify that the changes work as expected, we can:

1. Run the `surrogate` command with the `--help` option to display the help message.
2. Check that the help message includes detailed information about each command and option.
3. Test the error handling in the `install.sh` script and other commands to ensure that informative error messages are displayed.
4. Use the `surrogate` command with different options and commands to ensure that it works as expected.

By implementing this comprehensive help system, we can improve the user experience and provide better documentation for the Surrogate CLI.
