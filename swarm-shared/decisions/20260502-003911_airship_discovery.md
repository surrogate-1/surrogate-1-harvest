# airship / discovery

### Diagnosis
* The project lacks a unified discovery mechanism, making it difficult to find and utilize the various components and features of the Arkship Platform.
* The documentation is scattered, and it's challenging to locate specific information or guides for the platform.
* The Surrogate AI service, which is a crucial part of the Arkship Platform, has limited integration with the rest of the platform, hindering its potential.
* The project's architecture and microservices are not well-documented, making it hard to understand the relationships between different components.
* There is no clear guide on how to use the knowledge graph and vector store features of the Surrogate AI service.

### Proposed change
The proposed change is to create a unified discovery mechanism for the Arkship Platform, which will include a centralized documentation hub, an improved integration of the Surrogate AI service, and a clear guide on how to use the knowledge graph and vector store features.

The scope of this change will include the following files:
* `README.md`: Update the README file to include a clear overview of the project, its components, and features.
* `arkship/README.md`: Update the Arkship Platform README file to include a detailed guide on how to use the platform, its features, and components.
* `surrogate/README.md`: Update the Surrogate AI service README file to include a detailed guide on how to use the service, its features, and components.
* `docs/`: Create a new documentation hub that will include guides, tutorials, and references for the Arkship Platform and its components.

### Implementation
To implement this change, the following steps will be taken:
1. Update the `README.md` file to include a clear overview of the project, its components, and features.
2. Update the `arkship/README.md` file to include a detailed guide on how to use the Arkship Platform, its features, and components.
3. Update the `surrogate/README.md` file to include a detailed guide on how to use the Surrogate AI service, its features, and components.
4. Create a new documentation hub in the `docs/` directory that will include guides, tutorials, and references for the Arkship Platform and its components.
5. Add a new section to the `README.md` file that will link to the documentation hub and provide a clear overview of the available documentation.

Example code snippets:
```markdown
# README.md
## Introduction
The Arkship Platform is a comprehensive platform for infrastructure automation, incident management, and AI-powered DevOps assistance.

## Components
* Arkship Platform: A DevOps platform for infrastructure, workflows, and incident management.
* Surrogate AI: A standalone AI service for DevOps assistance.

## Documentation
For more information, please visit our [documentation hub](docs/).
```

```markdown
# arkship/README.md
## Introduction
The Arkship Platform is a DevOps platform for infrastructure, workflows, and incident management.

## Features
* Workflow Orchestration (Temporal)
* Incident Management (Perception Layer)
* Intent Language Compiler (YAML → IaC)
* Service Registry
* Blueprint Factory
* Artifact Registry
* Environment Registry
* Multi-cloud support (AWS, GCP, Azure)

## Guide
For a detailed guide on how to use the Arkship Platform, please visit our [documentation hub](../../docs/).
```

```markdown
# surrogate/README.md
## Introduction
The Surrogate AI service is a standalone AI service for DevOps assistance.

## Features
* Multi-model ensemble (Qwen + Mistral + DeepSeek-R1)
* 6 AI roles (Guardian, Navigator, Assembler, Sherlock, Auditor, Coach)
* 15 knowledge domains
* Knowledge Graph (Neo4j, 250+ tools)
* Vector Store (Qdrant, 130+ repos)
* Consensus Learning (GPT-4, Claude, Gemini, etc.)
* Auto-training (24/7)

## Guide
For a detailed guide on how to use the Surrogate AI service, please visit our [documentation hub](../../docs/).
```

```markdown
# docs/index.md
## Introduction
Welcome to the Arkship Platform documentation hub.

## Guides
* [Getting Started](getting-started.md)
* [Arkship Platform Guide](arkship-guide.md)
* [Surrogate AI Service Guide](surrogate-guide.md)

## Tutorials
* [Arkship Platform Tutorial](arkship-tutorial.md)
* [Surrogate AI Service Tutorial](surrogate-tutorial.md)

## References
* [Arkship Platform API Reference](arkship-api.md)
* [Surrogate AI Service API Reference](surrogate-api.md)
```
