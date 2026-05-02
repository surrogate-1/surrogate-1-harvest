# Costinel / backend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit issue. This involves pre-listing file paths once, embedding them in the training script, and using the CDN to bypass the API rate limit.

### Implementation Plan
1. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder.
2. **Save list to JSON**: Save the list of file paths to a JSON file.
3. **Embed in train.py**: Embed the JSON file in the `train.py` script.
4. **Use CDN for data load**: Use the CDN to download the dataset files, bypassing the API rate limit.

### Code Snippets
```python
import json
import requests

# Pre-list file paths
def pre_list_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/{repo}/list_repo_tree/{path}", recursive=False)
    file_paths = response.json()
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Embed in train.py
def load_dataset():
    with open("file_paths.json", "r") as f:
        file_paths = json.load(f)
    dataset = []
    for file_path in file_paths:
        response = requests.get(f"https://huggingface.co/{repo}/resolve/main/{file_path}")
        dataset.append(response.content)
    return dataset
```
### Example Use Case
To use this implementation, simply call the `pre_list_file_paths` function before training, and then use the `load_dataset` function to load the dataset.
```python
pre_list_file_paths("my_repo", "my_path")
dataset = load_dataset()
```
This implementation should take less than 2 hours to complete and will help to bypass the HF API rate limit issue.
