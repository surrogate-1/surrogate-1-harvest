# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can be shipped in under 2 hours is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the training script**: Locate the training script (`train.py`) that is currently using the HF API to download dataset files.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the desired dataset.
3. **Save file paths to JSON**: Save the list of file paths to a JSON file.
4. **Embed JSON in training script**: Modify the training script to read the file paths from the JSON file and use the HF CDN to download the files directly.
5. **Update training script to use CDN**: Modify the training script to use the HF CDN URL (`https://huggingface.co/datasets/{repo}/resolve/main/{path}`) to download the files without using the HF API.

### Code Snippets
```python
import json
import requests

# Pre-list file paths
def get_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=false")
    file_paths = response.json()
    return file_paths

# Save file paths to JSON
def save_file_paths(file_paths, json_file):
    with open(json_file, 'w') as f:
        json.dump(file_paths, f)

# Embed JSON in training script
def load_file_paths(json_file):
    with open(json_file, 'r') as f:
        file_paths = json.load(f)
    return file_paths

# Update training script to use CDN
def download_file(file_path):
    url = f"https://huggingface.co/datasets/{file_path}"
    response = requests.get(url)
    return response.content
```
### Example Use Case
```python
repo = "my-repo"
path = "my-path"
json_file = "file_paths.json"

file_paths = get_file_paths(repo, path)
save_file_paths(file_paths, json_file)

# In train.py
file_paths = load_file_paths(json_file)
for file_path in file_paths:
    file_content = download_file(file_path)
    # Process file content
```
This implementation plan should take under 2 hours to complete and will improve the performance of the training script by avoiding API rate-limit blocks.
