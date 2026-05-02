# Costinel / discovery

### High-Value Incremental Improvement
The highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit 429 error. This error occurs when the number of requests to the Hugging Face API exceeds 1000 requests per 5 minutes.

### Implementation Plan
To fix this issue, we will:
1. **Avoid recursive `list_repo_files` calls**: Instead of using `list_repo_files` recursively, which can lead to a large number of requests, we will use `list_repo_tree(path, recursive=False)` per folder.
2. **Paginate requests**: We will paginate our requests to ensure that we do not exceed the rate limit.
3. **Wait 360s before retrying**: If we encounter a 429 error, we will wait 360 seconds before retrying the request.

### Code Snippet
```python
import time
import requests

def list_repo_tree(repo_id, path, recursive=False):
    url = f"https://huggingface.co/api/v1/repo/{repo_id}/tree/{path}"
    params = {"recursive": recursive}
    response = requests.get(url, params=params)
    if response.status_code == 429:
        time.sleep(360)  # wait 360s before retrying
        return list_repo_tree(repo_id, path, recursive)
    return response.json()

# example usage
repo_id = "your-repo-id"
path = "your-path"
tree = list_repo_tree(repo_id, path)
print(tree)
```
This code snippet demonstrates how to use the `list_repo_tree` function to list the files in a repository while avoiding the 429 error. If a 429 error occurs, the function will wait 360 seconds before retrying the request.

### Tags
#huggingface #rate-limit #api #ingestion
