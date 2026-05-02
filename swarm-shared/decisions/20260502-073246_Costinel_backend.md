# Costinel / backend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the dataset repository**: Determine the repository containing the dataset files that need to be downloaded for training.
2. **Get the list of file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list of file paths to a JSON file.
3. **Embed the file list in the training script**: Modify the training script to read the list of file paths from the JSON file and download the files directly from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
4. **Update the training script to use CDN-only fetches**: Modify the training script to use the downloaded files instead of making API calls to fetch the data during training.

### Code Snippets
```python
import json
import requests

# Get the list of file paths
repo = "your-repo-name"
date_folder = "your-date-folder"
response = requests.get(f"https://huggingface.co/datasets/{repo}/tree/main/{date_folder}")
file_paths = [file["path"] for file in response.json()["files"]]

# Save the list of file paths to a JSON file
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)

# Embed the file list in the training script
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

# Download the files directly from the HF CDN
for file_path in file_paths:
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    response = requests.get(url)
    with open(file_path, "wb") as f:
        f.write(response.content)
```
### Benefits
This implementation plan avoids API rate-limit blocks during dataset training, allowing for faster and more efficient training processes. By downloading the files directly from the HF CDN, we can bypass the API rate limit and reduce the number of API calls made during training.
