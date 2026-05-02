# vanguard / discovery

### Diagnosis
* The Vanguard project lacks a comprehensive README file, making it challenging for new developers to understand the project's purpose, context, and functionality.
* The absence of a README file hinders the onboarding process for new team members and makes it challenging for them to contribute to the project.
* The project's discovery focus suggests that improving the project's documentation and knowledge management is crucial for effective discovery and research.

### Proposed change
Create a comprehensive README file for the Vanguard project, focusing on the discovery aspect. The README file should be located in the project's root directory (`/opt/axentx/vanguard/README.md`).

### Implementation
1. Create a new file `README.md` in the project's root directory (`/opt/axentx/vanguard/`).
2. Add the following content to the `README.md` file:
```markdown
# Vanguard Project
## Introduction
The Vanguard project is a research-focused initiative aimed at improving discovery and knowledge management.

## Discovery Focus
The project's discovery focus involves using business research with knowledge-rag pipeline to query top hub and related docs for contextual insights.

## Getting Started
To get started with the project, follow these steps:
1. Clone the repository: `git clone https://github.com/axentx/vanguard.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the market analysis script: `./granite-business-research.sh`
4. Execute knowledge-rag to query top hub and related docs: `knowledge-rag --query "top hub and related docs"`

## Contributing
To contribute to the project, please follow these guidelines:
1. Fork the repository: `git fork https://github.com/axentx/vanguard.git`
2. Create a new branch: `git branch feature/new-feature`
3. Commit changes: `git commit -m "Added new feature"`
4. Open a pull request: `git push origin feature/new-feature`
```
3. Commit the changes: `git add README.md && git commit -m "Added comprehensive README file"`

### Verification
To confirm that the README file is working as expected, follow these steps:
1. Clone the repository: `git clone https://github.com/axentx/vanguard.git`
2. Navigate to the project's root directory: `cd /opt/axentx/vanguard/`
3. Open the `README.md` file: `cat README.md`
4. Verify that the file contains the expected content and instructions for getting started with the project.
5. Follow the instructions in the `README.md` file to ensure that they are accurate and functional.
