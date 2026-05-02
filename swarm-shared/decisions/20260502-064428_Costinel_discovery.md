# Costinel / discovery

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files.

### Implementation Plan
1. **Identify the dataset files to download**: Review the training script and identify the dataset files that need to be downloaded.
2. **Use the HF CDN Bypass pattern**: Instead of using the `load_dataset` function with `streaming=True`, download the dataset files individually using the `hf_hub_download` function.
3. **Pre-list file paths once**: Make a single API call to `list_repo_tree` to get the list of file paths for the dataset, and save the list to a JSON file.
4. **Embed the file list in the training script**: Modify the training script to read the file list from the JSON file and download the files individually using the `hf_hub_download` function.

### Code Snippets
```python
import json
import os

# Pre-list file paths once
file_list = []
repo_id = "your-repo-id"
path = "your-path"
response = requests.get(f"https://huggingface.co/{repo_id}/tree/main/{path}")
file_list = [file["path"] for file in response.json()["files"]]

# Save the file list to a JSON file
with open("file_list.json", "w") as f:
    json.dump(file_list, f)

# Embed the file list in the training script
with open("file_list.json", "r") as f:
    file_list = json.load(f)

for file in file_list:
    file_path = f"https://huggingface.co/{repo_id}/resolve/main/{file}"
    response = requests.get(file_path)
    with open(file, "wb") as f:
        f.write(response.content)
```
### Benefits
This implementation plan avoids the API rate limit issue and allows for faster downloading of dataset files. It also reduces the number of API calls made during training, making the process more efficient.
