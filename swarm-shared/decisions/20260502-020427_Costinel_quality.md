# Costinel / quality

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit issue. This can be achieved by pre-listing file paths once and embedding them in the training script, as described in the pattern `pre-list file paths once, embed in training script`.

### Implementation Plan
To implement this fix, follow these steps:

1. **Identify the relevant script**: Locate the training script that is currently being used to train models with the Hugging Face (HF) dataset.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder to retrieve the list of file paths.
3. **Save the list to JSON**: Save the list of file paths to a JSON file.
4. **Embed the list in the training script**: Modify the training script to read the list of file paths from the JSON file and use it to fetch the files from the HF CDN.

### Code Snippets
Here are some code snippets to illustrate the implementation:
```python
import json
import requests

# Pre-list file paths
repo_id = "your-repo-id"
date_folder = "2026-04-29"
file_list_url = f"https://huggingface.co/api/v1/repo/{repo_id}/tree/{date_folder}?recursive=false"
response = requests.get(file_list_url)
file_list = response.json()["files"]

# Save the list to JSON
with open("file_list.json", "w") as f:
    json.dump(file_list, f)

# Embed the list in the training script
with open("file_list.json", "r") as f:
    file_list = json.load(f)

# Use the list to fetch files from HF CDN
for file in file_list:
    file_url = f"https://huggingface.co/{repo_id}/resolve/main/{file['path']}"
    # Fetch the file using the CDN URL
    response = requests.get(file_url)
    # Process the file
```
By implementing this fix, we can avoid the HF API rate limit issue and improve the efficiency of our training pipeline.
