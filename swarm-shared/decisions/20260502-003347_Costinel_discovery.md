# Costinel / discovery

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit 429 error. This error occurs when the `list_repo_files` function is called recursively on large repositories, exceeding the 1000 requests per 5 minutes limit.

### Implementation Plan
To fix this issue, we will use the `list_repo_tree` function with `recursive=False` to fetch files from each folder individually. We will also implement a retry mechanism with a 360-second wait time after encountering a 429 error.

### Code Snippet
```python
import requests
import time

def fetch_files(repo_id, path):
    try:
        response = requests.get(f"https://huggingface.co/api/v1/repo/{repo_id}/tree/{path}", params={"recursive": False})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as errh:
        if errh.response.status_code == 429:
            print("Rate limit exceeded. Waiting 360 seconds before retrying.")
            time.sleep(360)
            return fetch_files(repo_id, path)
        else:
            raise

# Example usage:
repo_id = "your-repo-id"
path = "your-path"
files = fetch_files(repo_id, path)
print(files)
```
This code snippet demonstrates how to fetch files from a repository using the `list_repo_tree` function with `recursive=False`. If a 429 error occurs, the function will wait 360 seconds before retrying the request.

### Deployment
To deploy this fix, we will update the `granite-business-research.sh` script to use the new `fetch_files` function. We will also update the `knowledge-rag` pipeline to use the new function when querying top hub and related documents for contextual insights.

### Testing
To test this fix, we will run the updated `granite-business-research.sh` script and verify that it can fetch files from large repositories without encountering the 429 error. We will also test the `knowledge-rag` pipeline to ensure that it can query top hub and related documents correctly using the new `fetch_files` function.
