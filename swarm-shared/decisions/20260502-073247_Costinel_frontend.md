# Costinel / frontend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit 429 error. This error occurs when the number of requests to the Hugging Face API exceeds 1000 requests per 5 minutes.

### Implementation Plan
To fix this issue, we will:

1. **Modify the `list_repo_files` function**: Instead of using the `list_repo_files` function recursively on big repositories, we will use the `list_repo_tree` function with `recursive=False` per folder. This will reduce the number of API calls and avoid the rate limit error.
2. **Implement pagination**: We will implement pagination to fetch files in batches, reducing the number of API calls and avoiding the rate limit error.
3. **Add a retry mechanism**: We will add a retry mechanism to wait for 360 seconds before retrying the API call if a 429 error occurs.

### Code Snippets
```python
import requests
import time

def list_repo_files(repo_id, path, recursive=False):
    # Use list_repo_tree with recursive=False per folder
    files = []
    for folder in list_repo_tree(repo_id, path, recursive=False):
        files.extend(list_repo_files(repo_id, folder, recursive=False))
    return files

def list_repo_tree(repo_id, path, recursive=False):
    # Implement pagination to fetch files in batches
    batch_size = 100
    files = []
    for i in range(0, 1000, batch_size):
        response = requests.get(f"https://huggingface.co/api/repo/{repo_id}/tree/{path}", params={"recursive": recursive, "page": i // batch_size})
        if response.status_code == 429:
            # Retry mechanism: wait for 360 seconds before retrying
            time.sleep(360)
            response = requests.get(f"https://huggingface.co/api/repo/{repo_id}/tree/{path}", params={"recursive": recursive, "page": i // batch_size})
        files.extend(response.json()["files"])
    return files
```
### Deployment
The modified code will be deployed to the production environment, and the changes will be verified to ensure that the HF API rate limit 429 error is resolved.

### Testing
The changes will be tested by simulating a large number of API calls to the Hugging Face API and verifying that the rate limit error is no longer occurring. Additionally, the code will be reviewed and tested by the development team to ensure that it meets the required standards and functionality.
