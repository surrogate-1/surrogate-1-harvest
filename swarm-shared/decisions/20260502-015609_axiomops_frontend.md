# axiomops / frontend

### Implementing HF CDN Bypass Pattern for AxiomOps Project
#### Overview
The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern. This involves modifying the training script to download dataset files directly from the Hugging Face CDN, bypassing the API rate limit.

#### Implementation Plan
1. **Identify the dataset repository**: Determine the Hugging Face dataset repository used by the AxiomOps project.
2. **Modify the training script**: Update the training script to download dataset files directly from the Hugging Face CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
3. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the dataset repository.
4. **Embed file list in training script**: Save the list of file paths to a JSON file and embed it in the training script.
5. **Use CDN-only fetches**: Modify the training script to use CDN-only fetches with zero API calls during data load.

#### Code Snippets
```python
import json
import requests

# Pre-list file paths
repo = "axiomops/dataset"
path = "main"
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")
file_paths = response.json()["files"]

# Save file list to JSON
with open("file_list.json", "w") as f:
    json.dump(file_paths, f)

# Embed file list in training script
with open("train.py", "r+") as f:
    code = f.read()
    f.seek(0)
    f.write(f"file_list = {json.dumps(file_paths)}\n")
    f.write(code)
    f.truncate()

# Use CDN-only fetches
def download_file(file_path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    response = requests.get(url)
    return response.content

# Example usage
file_list = json.load(open("file_list.json"))
for file_path in file_list:
    file_content = download_file(file_path)
    # Process file content
```
#### Expected Outcome
By implementing the HF CDN Bypass pattern, the AxiomOps project can bypass the API rate limit and download dataset files directly from the Hugging Face CDN, reducing the risk of rate limit errors and improving overall performance.
