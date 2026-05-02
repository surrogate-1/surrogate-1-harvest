# Costinel / discovery

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files.

### Implementation Plan
1. **Identify dataset files**: Pre-list file paths once using `list_repo_tree(path, recursive=False)` and save the list to a JSON file.
2. **Embed file list in training script**: Modify the training script to read the JSON file and use the CDN URLs to download dataset files without making API calls.
3. **Use CDN-only fetches**: Update the training script to use CDN-only fetches with zero API calls during data load.

### Code Snippets
```python
import json
import requests

# Pre-list file paths and save to JSON
def pre_list_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/{repo}/tree/main/{path}")
    file_paths = [file["path"] for file in response.json()["files"]]
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Embed file list in training script
def load_dataset(file_paths):
    dataset = []
    for file_path in file_paths:
        response = requests.get(f"https://huggingface.co/{repo}/resolve/main/{file_path}")
        dataset.extend(response.json())
    return dataset

# Use CDN-only fetches
def train_model(dataset):
    # Train model using dataset
    pass
```
### Example Use Case
```python
repo = "axentx/Costinel"
path = "data"
pre_list_file_paths(repo, path)

with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

dataset = load_dataset(file_paths)
train_model(dataset)
```
This implementation plan and code snippets demonstrate how to apply the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files, resulting in a high-value incremental improvement that can ship in <2h.
