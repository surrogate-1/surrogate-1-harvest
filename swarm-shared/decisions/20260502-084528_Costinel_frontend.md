# Costinel / frontend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the **HF CDN Bypass** pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list to a JSON file.
2. **Embed file list in training script**: Modify the training script to read the pre-listed file paths from the JSON file and use them to download the dataset files directly from the HF CDN.
3. **Use CDN-only fetches**: Update the training script to use CDN-only fetches with zero API calls during data load.

### Code Snippets
```python
import json
import requests

# Pre-list file paths
def pre_list_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/datasets/{repo}/tree/{path}")
    file_paths = response.json()
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Embed file list in training script
def load_dataset(file_paths):
    dataset = []
    for file_path in file_paths:
        response = requests.get(f"https://huggingface.co/datasets/{file_path}")
        dataset.append(response.json())
    return dataset

# Use CDN-only fetches
def train_model(dataset):
    # Train model using the dataset
    pass

# Example usage
repo = "your-repo"
path = "your-path"
pre_list_file_paths(repo, path)
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)
dataset = load_dataset(file_paths)
train_model(dataset)
```
### Benefits
The HF CDN Bypass pattern allows for faster dataset training by avoiding rate-limit blocks and reducing the number of API calls. This improvement can be shipped in <2h and provides a significant benefit to the Costinel platform.
