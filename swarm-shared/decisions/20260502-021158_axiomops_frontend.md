# axiomops / frontend

### Synthesized Solution: Implementing HF CDN Bypass for Efficient Dataset Ingestion and Training

After reviewing the proposals, the best approach to improve the efficiency of dataset ingestion and training in the AxiomOps platform is to implement the HF CDN Bypass pattern. This involves bypassing the HF API rate limit by downloading dataset files directly from the CDN, reducing the likelihood of rate limit errors and improving overall training efficiency.

#### Concrete Implementation Plan

1. **Pre-list File Paths**: Use the `list_repo_tree` API to retrieve the list of files in the dataset repository in a single API call. Save the list of files to a JSON file.
2. **Embed File List in Training Script**: Include the JSON file containing the list of files in the training script to avoid additional API calls during data loading.
3. **Modify Training Script to Use CDN Downloads**: Update the training script to download dataset files directly from the CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
4. **Update Studio Reuse Logic**: Reuse existing running studios instead of recreating them to save Lightning 80hr/mo quota when iterating training scripts.

#### Code Snippets

```python
import json
import requests

# Pre-list file paths
def pre_list_file_paths(repo, path):
    api_url = f"https://huggingface.co/datasets/{repo}/list_repo_tree"
    params = {"path": path, "recursive": False}
    response = requests.get(api_url, params=params)
    file_paths = response.json()
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Embed file list in training script
def load_file_paths():
    with open("file_paths.json", "r") as f:
        file_paths = json.load(f)
    return file_paths

# Modify training script to use CDN downloads
def download_file(file_path, repo):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    response = requests.get(url)
    with open(file_path, "wb") as f:
        f.write(response.content)

# Update studio reuse logic
def reuse_studio(studio_name):
    for s in Teamspace.studios:
        if s.name == studio_name and s.status == "Running":
            return s
    return None
```

#### Expected Outcome

By implementing the HF CDN Bypass pattern, the AxiomOps platform can:

* Bypass the HF API rate limit, reducing the likelihood of rate limit errors
* Improve the efficiency of dataset ingestion and training
* Save Lightning 80hr/mo quota when iterating training scripts

This incremental improvement can be shipped in under 2 hours and has a high potential impact on the project's success.
