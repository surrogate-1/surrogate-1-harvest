# Costinel / discovery

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the training script**: Locate the training script that is currently being blocked by the API rate limit.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the dataset.
3. **Save list to JSON**: Save the list of file paths to a JSON file.
4. **Embed JSON in training script**: Modify the training script to read the list of file paths from the JSON file and use the CDN URLs to download the files.
5. **Test the implementation**: Test the modified training script to ensure that it can download the files without being blocked by the API rate limit.

### Code Snippets
```python
import json
import requests

# Pre-list file paths
def get_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/{repo}/tree/main/{path}")
    file_paths = [file["path"] for file in response.json()]
    return file_paths

# Save list to JSON
def save_file_paths(file_paths, json_file):
    with open(json_file, "w") as f:
        json.dump(file_paths, f)

# Embed JSON in training script
def load_file_paths(json_file):
    with open(json_file, "r") as f:
        file_paths = json.load(f)
    return file_paths

# Example usage
repo = "username/repo"
path = "dataset"
json_file = "file_paths.json"

file_paths = get_file_paths(repo, path)
save_file_paths(file_paths, json_file)

# In the training script
file_paths = load_file_paths(json_file)
for file_path in file_paths:
    # Download file using CDN URL
    url = f"https://huggingface.co/{repo}/resolve/main/{file_path}"
    response = requests.get(url)
    # Process the file
```
This implementation plan and code snippets provide a concrete solution to avoid API rate-limit blocks during dataset training by using the HF CDN Bypass pattern.
