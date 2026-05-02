# Costinel / discovery

### Synthesized High-Value Incremental Improvement

Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files. This improvement combines the strongest insights from the candidate proposals, resolving contradictions in favor of correctness and concrete actionability.

### Implementation Plan

1. **Identify the dataset repository and files**: Determine the repository containing the dataset files that are being used for training. Review the training script and identify the dataset files that need to be downloaded.
2. **Pre-list file paths using the `list_repo_tree` API call**: Make a single API call to `list_repo_tree(path, recursive=False)` to get the list of file paths for the dataset. This call should be made from a location that can avoid blocking the training process.
3. **Save the file list to a JSON file**: Save the list of file paths to a JSON file that can be embedded in the training script.
4. **Modify the training script to use CDN URLs**: Update the training script to use the CDN URLs for downloading dataset files instead of the HF API. Construct the CDN URLs using the file paths saved in the JSON file.
5. **Test the modified training script**: Verify that the modified training script can successfully download the dataset files from the CDN and complete the training process without encountering rate-limit errors.

### Code Snippets

```python
import json
import requests

# Pre-list file paths using list_repo_tree API call
repo_id = "your-repo-id"
path = "your-path"
response = requests.get(f"https://huggingface.co/api/repo/{repo_id}/tree/{path}", params={"recursive": False})
file_list = response.json()["files"]

# Save the file list to a JSON file
with open("file_list.json", "w") as f:
    json.dump(file_list, f)

# Load file paths from JSON file in training script
with open('file_list.json') as f:
    file_list = json.load(f)

# Construct CDN URLs using file paths
cdn_urls = []
for file in file_list:
    cdn_url = f"https://huggingface.co/{repo_id}/resolve/main/{file['path']}"
    cdn_urls.append(cdn_url)

# Use CDN URLs to download dataset files
for cdn_url in cdn_urls:
    response = requests.get(cdn_url)
    with open(file['path'], "wb") as f:
        f.write(response.content)
```

### Expected Outcome

By implementing the HF CDN Bypass pattern, the training process should be able to download dataset files from the CDN without encountering rate-limit errors, allowing for faster and more efficient training. The dataset files will be downloaded successfully without hitting the API rate limit, and the training script will be able to proceed without interruptions. This improvement is expected to reduce API rate limit errors and improve the efficiency of the training script.
