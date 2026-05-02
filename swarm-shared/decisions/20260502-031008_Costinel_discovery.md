# Costinel / discovery

### High-Value Incremental Improvement
#### Improvement: Implement HF CDN Bypass for Dataset Training
The highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass for dataset training. This involves downloading public dataset files from the HF CDN without using the HF API, which bypasses the rate limit entirely.

#### Implementation Plan
1. **Identify datasets**: Identify the datasets used in the training pipeline that are affected by the HF API rate limit.
2. **Modify training script**: Modify the training script to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
3. **Pre-list file paths**: Pre-list the file paths for the dataset using a single API call to `list_repo_tree(path, recursive=False)` and save the list to a JSON file.
4. **Embed file list in training script**: Embed the file list in the training script to download the files from the HF CDN without making API calls during data load.

#### Code Snippet
```python
import json
import requests

# Pre-list file paths
repo = "dataset/repo"
path = "path/to/dataset"
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")
file_list = response.json()["files"]

# Save file list to JSON
with open("file_list.json", "w") as f:
    json.dump(file_list, f)

# Modify training script to download files from HF CDN
with open("file_list.json", "r") as f:
    file_list = json.load(f)

for file in file_list:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
    response = requests.get(file_url)
    with open(file, "wb") as f:
        f.write(response.content)
```
This implementation plan and code snippet can be completed in <2h and will improve the efficiency of the dataset training pipeline by bypassing the HF API rate limit.
