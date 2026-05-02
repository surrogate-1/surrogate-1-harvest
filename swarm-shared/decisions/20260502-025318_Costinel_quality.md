# Costinel / quality

### Synthesized Solution: HF API Rate Limit Fix and CDN Bypass

The highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit issue by combining the strongest insights from the provided candidates. This involves modifying API calls to reduce the number of requests, implementing a retry mechanism, and using the HF CDN to bypass API rate limits when downloading dataset files.

#### Implementation Plan

1. **Identify affected code and repository structure**: Locate the code sections that interact with the HF API and determine the repository and file structure for the Costinel project.
2. **Modify API calls**: Replace recursive `list_repo_files` calls with `list_repo_tree(path, recursive=False)` to reduce the number of API requests.
3. **Implement retry mechanism**: After encountering a 429 error, wait 360s before retrying the API call.
4. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list to a JSON file.
5. **Embed file list in training script**: Modify the training script to read the pre-listed file paths from the JSON file and use them to download the files from the HF CDN.
6. **Use HF CDN for file downloads**: Update the training script to download files from the HF CDN using the pre-listed file paths, bypassing the API rate limit.

#### Code Snippets

```python
import time
import requests
import json

def list_repo_tree(repo_id, path, recursive=False):
    # Implement list_repo_tree API call
    url = f"https://huggingface.co/api/v1/repo/{repo_id}/tree/{path}"
    params = {"recursive": recursive}
    response = requests.get(url, params=params)
    return response.json()

def fetch_repo_files(repo_id):
    try:
        # Use list_repo_tree instead of list_repo_files
        files = list_repo_tree(repo_id, "", recursive=False)
        return files
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            # Wait 360s before retrying
            time.sleep(360)
            return fetch_repo_files(repo_id)
        else:
            raise e

def save_file_list(repo, path, date_folder):
    url = f"https://huggingface.co/datasets/{repo}/tree/main/{path}"
    response = requests.get(url)
    file_list = response.json()
    with open(f"file_list_{date_folder}.json", "w") as f:
        json.dump(file_list, f)

def load_dataset(repo, path, date_folder):
    file_list_path = f"file_list_{date_folder}.json"
    with open(file_list_path, "r") as f:
        file_list = json.load(f)
    dataset = []
    for file in file_list:
        file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}/{file}"
        response = requests.get(file_url)
        dataset.append(response.content)
    return dataset

# Pre-list file paths and save to JSON
repo_name = "costinel-data"
date_folder = "2026-05-02"
save_file_list(repo_name, "", date_folder)

# Load dataset using HF CDN
dataset = load_dataset(repo_name, "", date_folder)
```

#### Benefits

This synthesized solution combines the strengths of the provided candidates, allowing the Costinel platform to:

* Reduce the number of API requests and avoid recursive calls
* Implement a retry mechanism to handle 429 rate limit errors
* Bypass API rate limits when downloading dataset files using the HF CDN
* Improve overall performance and reliability

By implementing this solution, the Costinel project can ship a high-value incremental improvement in under 2 hours, addressing the HF API rate limit issue and improving the overall performance of the platform.
