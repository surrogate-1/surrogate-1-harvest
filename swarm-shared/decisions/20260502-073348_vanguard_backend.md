# vanguard / backend

### 1. **Diagnosis**
* The Vanguard project lacks a comprehensive solution to handle HF API rate limits, which can block dataset training and hinder the project's progress.
* The current implementation does not utilize the HF CDN bypass strategy, which can download public dataset files without authorization headers and bypass rate limits.
* The project does not have a robust solution to handle Lightning Studio idle timeouts, which can kill training processes and require manual restarts.
* The absence of a README file and lack of documentation make it challenging for new developers to understand the project's purpose, context, and functionality.
* The project's architecture does not strictly follow the Mac=CLI rule, which can lead to heavy compute tasks being run on remote machines and causing inefficiencies.

### 2. **Proposed change**
The proposed change is to implement the HF CDN bypass strategy and utilize the `list_repo_tree` method to pre-list file paths once and embed them in the training script. This change will be made in the `train.py` file, which is responsible for training the model.

### 3. **Implementation**
To implement the proposed change, the following steps will be taken:
1. Modify the `train.py` file to use the `list_repo_tree` method to pre-list file paths once and embed them in the training script.
2. Utilize the HF CDN bypass strategy to download public dataset files without authorization headers.
3. Implement a retry mechanism to handle rate limits and idle timeouts.

```python
import json
import requests

# Pre-list file paths once and embed them in the training script
def get_file_paths(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    file_paths = []
    for file in response.json():
        file_paths.append(file["path"])
    return file_paths

# Utilize the HF CDN bypass strategy to download public dataset files
def download_file(file_path):
    url = f"https://huggingface.co/datasets/{file_path}"
    response = requests.get(url)
    return response.content

# Implement a retry mechanism to handle rate limits and idle timeouts
def retry_function(func, max_retries=5):
    def wrapper(*args, **kwargs):
        for i in range(max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(f"Retry {i+1}/{max_retries}: {str(e)}")
                time.sleep(60)  # wait 1 minute before retrying
        raise Exception("Max retries exceeded")
    return wrapper

# Example usage:
file_paths = get_file_paths("repo", "path")
for file_path in file_paths:
    file_content = download_file(file_path)
    # Process the file content
```

### 4. **Verification**
To verify that the proposed change works, the following steps will be taken:
1. Run the modified `train.py` file and verify that it can download public dataset files without authorization headers.
2. Monitor the training process and verify that it can handle rate limits and idle timeouts.
3. Verify that the retry mechanism is working correctly by simulating rate limits and idle timeouts.
4. Compare the performance of the modified `train.py` file with the original implementation to ensure that it is more efficient and robust.
