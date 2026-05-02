# airship / frontend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files.

### Implementation Plan
1. **Identify the dataset files to download**: Review the `train.py` script and identify the dataset files that are being downloaded using the HF API.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list of file paths to a JSON file.
3. **Embed file list in training script**: Modify the `train.py` script to read the file list from the JSON file and download the files using the HF CDN bypass pattern.
4. **Update the download logic**: Replace the existing download logic with the HF CDN bypass pattern, using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL to download the files without authentication.

### Code Snippets
```python
import json
import requests

# Pre-list file paths
def pre_list_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")
    file_paths = response.json()["files"]
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Embed file list in training script
def download_files(file_paths):
    for file_path in file_paths:
        url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
        response = requests.get(url)
        with open(file_path, "wb") as f:
            f.write(response.content)

# Update the download logic
def train():
    with open("file_paths.json", "r") as f:
        file_paths = json.load(f)
    download_files(file_paths)
    # Rest of the training script...
```
### Example Use Case
To use this implementation, simply run the `train.py` script, which will download the dataset files using the HF CDN bypass pattern and train the model.
```bash
python train.py
```
This implementation should take less than 2 hours to complete and will improve the performance of the training script by avoiding API rate limits.
