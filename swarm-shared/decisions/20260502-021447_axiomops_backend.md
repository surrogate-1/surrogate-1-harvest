# axiomops / backend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can be shipped in <2h is to implement a fix for the HF API rate limit 429 error. This error occurs when the API receives too many requests within a short period, and it can be resolved by avoiding recursive `list_repo_files` calls on big repositories and using `list_repo_tree` with `recursive=False` instead.

### Implementation Plan
1. **Identify the affected code**: Locate the code that is making the recursive `list_repo_files` calls on big repositories.
2. **Replace with `list_repo_tree`**: Modify the code to use `list_repo_tree` with `recursive=False` to fetch files from each folder individually.
3. **Handle pagination**: Implement pagination to handle cases where there are more than 100 files in a folder.
4. **Add retry mechanism**: Add a retry mechanism to handle cases where the API returns a 429 error. The retry mechanism should wait for 360 seconds before retrying the request.

### Code Snippet
```python
import requests
import time

def list_repo_files(repo_id, path):
    # Replace recursive list_repo_files with list_repo_tree
    url = f"https://huggingface.co/api/v1/repo/{repo_id}/tree/{path}"
    params = {"recursive": False}
    response = requests.get(url, params=params)
    
    if response.status_code == 429:
        # Handle 429 error
        time.sleep(360)  # Wait for 360 seconds
        return list_repo_files(repo_id, path)
    else:
        return response.json()

def main():
    repo_id = "your-repo-id"
    path = "your-path"
    files = list_repo_files(repo_id, path)
    print(files)

if __name__ == "__main__":
    main()
```
This code snippet demonstrates how to replace the recursive `list_repo_files` calls with `list_repo_tree` and handle the 429 error by waiting for 360 seconds before retrying the request.
