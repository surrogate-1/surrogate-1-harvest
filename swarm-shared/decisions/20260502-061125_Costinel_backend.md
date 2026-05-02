# Costinel / backend

### Highest-Value Incremental Improvement
Based on the provided patterns, lessons learned, and project context, the highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit issue.

### Implementation Plan
#### Fix: HF API Rate Limit Bypass
To bypass the HF API rate limit, we can use the HF CDN to download dataset files without making API calls. We will:

1. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to get the list of file paths for a specific date folder.
2. **Save list to JSON**: Save the list of file paths to a JSON file.
3. **Embed in training script**: Embed the JSON file in the training script to use the CDN URLs for downloading dataset files.

#### Code Snippets
```python
import json
import requests

# Pre-list file paths
repo_id = "your-repo-id"
date_folder = "your-date-folder"
response = requests.get(f"https://huggingface.co/api/repo/{repo_id}/tree/{date_folder}", recursive=False)
file_paths = response.json()

# Save list to JSON
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)

# Embed in training script
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

# Use CDN URLs for downloading dataset files
for file_path in file_paths:
    cdn_url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{file_path}"
    # Download dataset file using CDN URL
    response = requests.get(cdn_url)
    # Process dataset file
```
#### Benefits
This fix will allow us to bypass the HF API rate limit and download dataset files using the HF CDN, reducing the number of API calls and increasing the efficiency of our training pipeline.

#### Estimated Time to Ship
This improvement can be shipped in <2h, as it only requires modifying the training script to use the HF CDN and saving the list of file paths to a JSON file.
