# surrogate / backend

### Diagnosis
* The Surrogate CLI lacks a comprehensive help command, making it difficult for users to access detailed information about available commands and options.
* The current help output is limited and does not provide sufficient information about the usage of each command.
* There is no clear documentation on how to use the Surrogate CLI, leading to a steep learning curve for new users.
* The Surrogate CLI does not provide any examples or usage guidelines for its various commands and options.
* The lack of a comprehensive help command hinders the overall user experience and makes it challenging for users to effectively utilize the Surrogate CLI.

### Proposed change
The proposed change involves modifying the `surrogate` command to include a comprehensive help command. This can be achieved by updating the `surrogate.py` file, specifically the `parse_args` function, to include a `--help` option that displays detailed information about available commands and options.

### Implementation
To implement the comprehensive help command, the following steps can be taken:
1. Open the `surrogate.py` file and locate the `parse_args` function.
2. Add a `--help` option to the `argparse` parser.
3. Define a `help` function that displays detailed information about available commands and options.
4. Call the `help` function when the `--help` option is specified.

Example code snippet:
```python
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description='Surrogate CLI')
    parser.add_argument('--help', action='help', help='Show this help message and exit')
    # ... other arguments ...
    return parser.parse_args()

def help():
    print("Surrogate CLI Help")
    print("--------------------")
    print("Available commands:")
    print("  surrogate          Interactive REPL")
    print("  surrogate <task>   One-shot task")
    print("  surrogate --auto    Plan-driven auto mode")
    print("  surrogate init     Scaffold SURROGATE.md for this project")
    print("  surrogate plan set  Drive tasks from a markdown checklist")
    print("  surrogate plan show Show plan progress")
    print("  surrogate --status  Session + corpus stats")

if __name__ == '__main__':
    args = parse_args()
    if args.help:
        help()
    # ... other logic ...
```
### Verification
To verify that the comprehensive help command works as expected, the following steps can be taken:
1. Run the `surrogate` command with the `--help` option: `surrogate --help`
2. Verify that the output displays detailed information about available commands and options.
3. Test each command and option to ensure that it works as expected.
4. Verify that the help output is accurate and up-to-date with the latest changes to the Surrogate CLI.
