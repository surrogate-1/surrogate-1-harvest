# surrogate / discovery

### Synthesized Solution

The Surrogate CLI lacks a comprehensive help command, making it difficult for users to access detailed information about available commands and options. To address this issue, we will implement a comprehensive help command that provides detailed information about available commands and options.

### Proposed Change

The proposed change is to enhance the Surrogate CLI help command by adding a more comprehensive and detailed output. This will involve modifying the `surrogate` script to include a `--help` flag that displays detailed information about available commands and options.

### Implementation

To implement the comprehensive help command, we will modify the `surrogate` script as follows:
```bash
# File: /opt/axentx/surrogate/surrogate
# Line: 100-120
print_help() {
  echo "Surrogate CLI AI assistant"
  echo "---------------------------"
  echo "Usage: surrogate [command] [options]"
  echo ""
  echo "Commands:"
  echo "  init       Scaffold SURROGATE.md for this project"
  echo "  plan       Drive tasks from a markdown checklist"
  echo "  plan set   Set TODO.md as the task list"
  echo "  plan show  Show plan progress"
  echo "  show       Show plan progress"
  echo "  status     Session + corpus stats"
  echo ""
  echo "Options:"
  echo "  -h, --help      Display this help message"
  echo "  --version       Display the version number"
  echo "  --auto          Plan-driven auto mode"
  echo "  --prefix        Custom install prefix"
  echo "  --uninstall     Uninstall Surrogate CLI"
  echo ""
  echo "Example usage:"
  echo "  surrogate init"
  echo "  surrogate plan set TODO.md"
  echo "  surrogate --auto"
}

# Add a new function to display the version number
print_version() {
  echo "Surrogate CLI version 1.0.0"
}

# Modify the main function to call print_help and print_version
main() {
  case $1 in
    --help)
      print_help
      ;;
    --version)
      print_version
      ;;
    *)
      # existing code
      ;;
  esac
}
```
We will also add a `--help` flag to the `parse_args` function to handle the help command.

### Verification

To verify that the comprehensive help command works as expected, we can run the following commands:
```bash
surrogate --help
surrogate -h
```
Both commands should display the detailed help output, including usage instructions, available commands, and options. We can also test the help command with different flags and options to ensure that it provides accurate and helpful information. For example:
```bash
surrogate init --help
surrogate plan --help
```
These commands should display specific help output for the `init` and `plan` commands, respectively.

### Additional Recommendations

* Consider adding a `--usage` flag to display a brief usage message.
* Use a consistent formatting style throughout the help output.
* Consider adding examples for each command and option to help users understand how to use the tool effectively.
* Use a standard convention for command-line interfaces, such as using `--` for long options and `-` for short options.
* Consider adding a `--man` flag to display the manual page for the Surrogate CLI.
* Use a version control system to track changes to the Surrogate CLI and ensure that the help output is up-to-date with the latest changes.
