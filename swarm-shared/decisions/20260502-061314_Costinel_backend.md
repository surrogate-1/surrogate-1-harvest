# Costinel / backend

**Highest-Value Incremental Improvement:**
**Fix HF API rate limit 429 (1000 req/5min) for Surrogate-1 Training Pipeline**

**Implementation Plan:**

1. **Avoid `list_repo_files` recursive on big repos**:
   - Use `list_repo_tree(path, recursive=False)` per folder instead of recursively listing all files in a repository.
   - This will reduce the number of API calls and avoid hitting the rate limit.

2. **Wait 360s before retry after 429**:
   - Implement a retry mechanism with a 360-second wait period after hitting the rate limit.
   - This will allow the API to reset and avoid further rate limit issues.

**Code Snippet:**
```python
import requests
import time

def list_repo_files(repo, path):
    # Avoid recursive listing of all files in a repository
    response = requests.get(f"https://huggingface.co/{repo}/api/v1/repos/tree/{path}", 
                            headers={"Authorization": f"Bearer {hf_token}"}, 
                            params={"recursive": False})
    if response.status_code == 429:
        # Wait 360s before retry
        time.sleep(360)
        return list_repo_files(repo, path)
    return response.json()

# Example usage:
repo = "surrogate-1"
path = "main"
files = list_repo_files(repo, path)
```
**Additional Notes:**

*   This implementation will reduce the number of API calls and avoid hitting the rate limit.
*   The retry mechanism with a 360-second wait period will help avoid further rate limit issues.
*   This improvement will ensure that the Surrogate-1 Training Pipeline can run smoothly without hitting the rate limit.
