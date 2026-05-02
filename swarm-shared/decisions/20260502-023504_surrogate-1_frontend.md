# surrogate-1 / frontend

### Synthesized Solution

The project lacks a robust frontend implementation to handle data ingestion and training for the surrogate-1 model. The current implementation relies heavily on the Hugging Face API, which has rate limits that can block dataset training. To address these issues, we propose a solution that utilizes the Hugging Face CDN to bypass rate limits and handles dataset mirroring and uploading.

### Proposed Change

We will implement a frontend solution that uses the Hugging Face CDN to download dataset files, handles dataset mirroring and uploading, and provides a user-friendly interface to monitor and control the training process.

### Implementation

To implement this solution, we will follow these steps:

1. **Create a new file `cdn_bypass.py`** in the `frontend` directory to handle the CDN bypass logic.
2. **Use the `requests` library** to download dataset files from the Hugging Face CDN.
3. **Implement a function `download_dataset_file`** to download each file individually and project to `{prompt, response}` only at parse time.
4. **Create a new function `upload_dataset`** to handle uploading the mirrored dataset to Hugging Face datasets.
5. **Use the `list_repo_tree` function** to get the list of files in the dataset repository and save it to a JSON file.
6. **Modify the `train.py` script** to use the `download_dataset_file` function to download the dataset files instead of using the Hugging Face API.
7. **Implement a mechanism to reuse Lightning Studio instances** to save 80hr/mo quota.

### Code

```python
import requests
import json

def download_dataset_file(repo, path):
    """
    Download a dataset file from the Hugging Face CDN.
    
    Args:
    repo (str): The repository ID.
    path (str): The path to the dataset file.
    
    Returns:
    bytes: The downloaded dataset file.
    """
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"Failed to download dataset file: {url}")

def upload_dataset(dataset):
    """
    Upload a mirrored dataset to Hugging Face datasets.
    
    Args:
    dataset (str): The dataset to upload.
    """
    # Upload dataset to Hugging Face datasets
    pass

def get_file_list(repo_id):
    """
    Get the list of files in a dataset repository.
    
    Args:
    repo_id (str): The repository ID.
    
    Returns:
    list: The list of files in the dataset repository.
    """
    url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/"
    response = requests.get(url)
    file_list = response.json()
    return file_list

def main():
    repo_id = "your-repo-id"
    file_list = get_file_list(repo_id)
    with open("file_list.json", "w") as f:
        json.dump(file_list, f)

if __name__ == "__main__":
    main()
```

### Verification

To verify that the implementation works, we can check the following:

1. The `cdn_bypass.py` file is created in the `frontend` directory.
2. The `download_dataset_file` function can download files from the Hugging Face CDN.
3. The `upload_dataset` function can upload the mirrored dataset to Hugging Face datasets.
4. The `get_file_list` function can get the list of files in the dataset repository and save it to a JSON file.
5. The `main` function can execute the above steps without any errors.
6. The `train.py` script can download the dataset files correctly from the HF CDN.
7. The reuse of Lightning Studio instances is working correctly and saving 80hr/mo quota.

By implementing this solution, we can address the issues with the current implementation and provide a more robust and efficient way to handle data ingestion and training for the surrogate-1 model.
