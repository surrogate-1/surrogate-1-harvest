# axiomops / backend

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify Public Dataset Files**: Use the Hugging Face API to list the files in the dataset repository. This can be done by calling `list_repo_tree(path, recursive=False)` for one date folder.
2. **Save File List to JSON**: Save the list of files to a JSON file. This will be used to embed the file list in the training script.
3. **Modify Training Script**: Modify the training script to use the CDN URLs for downloading dataset files. This can be done by replacing the `load_dataset` function with a custom function that downloads files from the CDN.
4. **Implement CDN Bypass**: Implement the HF CDN Bypass pattern by downloading dataset files from the CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL.

### Code Snippets
```python
import json
import requests

# List files in dataset repository
def list_files(repo, path):
    url = f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False"
    response = requests.get(url)
    files = response.json()["files"]
    return files

# Save file list to JSON
def save_file_list(files, filename):
    with open(filename, "w") as f:
        json.dump(files, f)

# Load file list from JSON
def load_file_list(filename):
    with open(filename, "r") as f:
        files = json.load(f)
    return files

# Download file from CDN
def download_file(url, filename):
    response = requests.get(url)
    with open(filename, "wb") as f:
        f.write(response.content)

# Modify training script to use CDN URLs
def train_model(file_list):
    for file in file_list:
        url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
        download_file(url, file)
        # Train model using downloaded file
```
### Example Use Case
```python
repo = "axiomops/dataset"
path = "2023-02-20"
filename = "file_list.json"

# List files in dataset repository
files = list_files(repo, path)

# Save file list to JSON
save_file_list(files, filename)

# Load file list from JSON
file_list = load_file_list(filename)

# Train model using CDN URLs
train_model(file_list)
```
This implementation plan and code snippets provide a concrete solution to avoid rate-limit blocks during dataset training by using the HF CDN Bypass pattern. The example use case demonstrates how to list files in a dataset repository, save the file list to a JSON file, load the file list from the JSON file, and train a model using the CDN URLs.
