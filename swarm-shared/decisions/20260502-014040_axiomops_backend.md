# axiomops / backend

### Synthesized Implementation of HF CDN Bypass Pattern for AxiomOps Project

The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training. This approach combines the strongest insights from multiple proposals, resolving contradictions in favor of correctness and concrete actionability.

#### Concrete Implementation Plan

1. **Identify Dataset Repositories**: List the Hugging Face dataset repositories used in the AxiomOps project.
2. **Pre-list File Paths**: Use the Hugging Face API to pre-list file paths for each repository, and save the list to a JSON file. This can be achieved by making a single API call to `list_repo_tree(path, recursive=False)` for one date folder.
3. **Modify Training Script**: Update the training script to use the pre-listed file paths and download dataset files directly from the Hugging Face CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
4. **Implement CDN Bypass**: Modify the dataset loading code to use the CDN bypass pattern, avoiding the Hugging Face API rate limit.

#### Code Snippets

```python
import json
import requests

# Pre-list file paths
def pre_list_file_paths(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/tree/main/{path}"
    response = requests.get(url)
    file_paths = response.json()["files"]
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Load dataset files from CDN
def load_dataset_from_cdn(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    return response.content

# Embed file list in training script
def load_dataset(file_paths):
    dataset = []
    for file_path in file_paths:
        url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
        response = requests.get(url)
        dataset.append(response.content)
    return dataset

# Example usage
repo = "axiomops/dataset"
path = "data/train.csv"
pre_list_file_paths(repo, path)
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)
dataset = load_dataset(file_paths)
```

#### Expected Outcome

By implementing the HF CDN Bypass pattern, the AxiomOps project can:

* Avoid rate-limit blocks during dataset training
* Reduce the number of API calls during training
* Improve training performance by using the CDN for dataset file downloads
* Reduce the time and resources required for training
* Improve overall system performance

#### Estimated Time to Ship

* 1 hour to implement the HF CDN Bypass pattern
* 30 minutes to test and verify the implementation
* 30 minutes to review and refine the code
Total estimated time to ship: 2 hours

This synthesized implementation provides a concrete and actionable solution to the problem, combining the strongest insights from multiple proposals and resolving contradictions in favor of correctness and concrete actionability.
