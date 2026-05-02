# surrogate / frontend

### Diagnosis
* The Surrogate CLI lacks a comprehensive help command, making it difficult for users to access detailed information about available commands and options.
* The current help output is limited and does not provide sufficient information about the usage of each command.
* The Surrogate CLI does not have a user-friendly interface for displaying help information, making it hard for users to navigate and understand the available commands.
* There is no clear documentation on how to use the Surrogate CLI, leading to confusion and frustration among users.
* The Surrogate CLI does not follow standard CLI design principles, making it difficult for users to intuitively understand how to use the tool.

### Proposed change
The proposed change is to implement a comprehensive help command in the Surrogate CLI. This will involve modifying the `surrogate` script to include a help command that displays detailed information about available commands and options. The scope of this change will be limited to the `surrogate` script and the `install.sh` script, which sets up the Surrogate CLI.

### Implementation
To implement the comprehensive help command, we will use the following steps:

1. Modify the `surrogate` script to include a help command that displays detailed information about available commands and options.
2. Use a standard help library, such as `argparse`, to generate the help output.
3. Update the `install.sh` script to include documentation on how to use the Surrogate CLI.

Here is an example of how the `surrogate` script could be modified to include a help command:
```bash
#!/bin/bash

# ... existing code ...

usage() {
  echo "Usage: surrogate [command] [options]"
  echo ""
  echo "Commands:"
  echo "  init          Initialize the Surrogate CLI"
  echo "  plan          Manage plans"
  echo "  --auto        Run in auto mode"
  echo "  --status      Display session and corpus stats"
  echo ""
  echo "Options:"
  echo "  -h, --help    Display this help message"
}

while [ $# -gt 0 ]; do
  case $1 in
    -h|--help)
      usage
      exit 0
      ;;
    # ... existing code ...
  esac
  shift
done

# ... existing code ...
```
We will also update the `install.sh` script to include documentation on how to use the Surrogate CLI:
```bash
#!/bin/bash

# ... existing code ...

echo "Surrogate CLI installed successfully!"
echo "To use the Surrogate CLI, run the following command:"
echo "  surrogate [command] [options]"
echo ""
echo "For more information, run the following command:"
echo "  surrogate --help"
```
### Verification
To verify that the comprehensive help command works as expected, we can run the following commands:
```bash
surrogate --help
surrogate -h
```
These commands should display the detailed help output, including information about available commands and options. We can also test the help command with different options and commands to ensure that it works as expected. Additionally, we can verify that the documentation on how to use the Surrogate CLI is included in the `install.sh` script by running the installation script and checking the output.
