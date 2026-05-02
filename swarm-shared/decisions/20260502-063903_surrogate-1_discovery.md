# surrogate-1 / discovery

### **Diagnosis**
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* The existing implementation may not be reusing existing Lightning Studio instances efficiently.
* The project does not have a clear strategy for downloading dataset files from the Hugging Face CDN, which can bypass API rate limits.
* The current implementation may not be handling errors and exceptions properly, leading to potential issues with training and data ingestion.
* The project could benefit from a more efficient way to manage and reuse existing Lightning Studio instances to save quota and reduce costs.

### **Proposed change**
The proposed change is to implement a robust Hugging Face API rate limit handler and a strategy for downloading dataset files from the Hugging Face CDN. This will involve modifying the `train.py` script to use the CDN for dataset downloads and implementing a rate limit handler to avoid blocking dataset training.

### **Implementation**
To implement this change, we will:
1. Modify the `train.py` script to download dataset files from the Hugging Face CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
2. Implement a rate limit handler using the `list_repo_tree` API call to pre-list file paths and embed them in the training script.
3. Use the `requests` library to download dataset files from the CDN with no Authorization header.
4. Implement a retry mechanism to handle rate limit errors and exceptions.

Example code snippet:
```python
import requests
import json

# Pre-list file paths using list_repo_tree API call
repo = "my-repo"
path = "my-path"
response = requests.get(f"https://huggingface.co/datasets/{repo}/tree/main/{path}")
file_paths = response.json()["files"]

# Download dataset files from CDN
for file_path in file_paths:
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    response = requests.get(url)
    with open(file_path, "wb") as f:
        f.write(response.content)

# Implement rate limit handler
def handle_rate_limit(error):
    if error.response.status_code == 429:
        # Wait 360s before retrying
        time.sleep(360)
        return True
    return False
```

### **Verification**
To verify that the implementation works, we can:
1. Run the modified `train.py` script and check that dataset files are downloaded from the CDN correctly.
2. Monitor the API rate limit and verify that the rate limit handler is triggered correctly when the limit is reached.
3. Check the Lightning Studio instance reuse and verify that existing instances are reused efficiently to save quota and reduce costs.
4. Test the implementation with different dataset sizes and types to ensure that it works correctly in various scenarios.
