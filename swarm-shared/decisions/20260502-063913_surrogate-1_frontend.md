# surrogate-1 / frontend

### Diagnosis
* The project lacks a robust implementation for handling Hugging Face API rate limits on the frontend, which can block dataset training.
* The existing implementation may not be reusing existing Lightning Studio instances efficiently, leading to wasted resources and quota.
* The frontend does not have a mechanism to bypass the Hugging Face API rate limit using the CDN, which can significantly improve training performance.
* The project does not have a clear and efficient way to handle studio reuse and idle timeout, which can cause training processes to die unexpectedly.
* The frontend does not have a robust error handling mechanism for handling errors related to Hugging Face API, Lightning Studio, and other external services.

### Proposed change
The proposed change will focus on implementing a robust mechanism to bypass the Hugging Face API rate limit using the CDN on the frontend. This will involve modifying the `train.py` script to use the CDN for downloading dataset files instead of the Hugging Face API.

### Implementation
To implement this change, we will need to modify the `train.py` script to use the CDN for downloading dataset files. We can do this by replacing the `list_repo_files` function with a function that downloads the file list from the CDN. We will also need to modify the `download_dataset` function to use the CDN for downloading dataset files.

Here is an example of how the modified `train.py` script could look:
```python
import json
import requests

# Download file list from CDN
def download_file_list(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    file_list = response.json()
    return file_list

# Download dataset files from CDN
def download_dataset(repo, path, file_list):
    dataset_files = []
    for file in file_list:
        url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}/{file}"
        response = requests.get(url)
        dataset_files.append(response.content)
    return dataset_files

# Train model using dataset files
def train_model(dataset_files):
    # Train model using dataset files
    pass

# Main function
def main():
    repo = "axentx/surrogate-1"
    path = "dataset"
    file_list = download_file_list(repo, path)
    dataset_files = download_dataset(repo, path, file_list)
    train_model(dataset_files)

if __name__ == "__main__":
    main()
```
We will also need to modify the `list_repo_tree` function to use the CDN for downloading the file list. We can do this by replacing the `list_repo_tree` function with a function that downloads the file list from the CDN.

Here is an example of how the modified `list_repo_tree` function could look:
```python
import json
import requests

# Download file list from CDN
def list_repo_tree(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    file_list = response.json()
    return file_list
```
### Verification
To verify that the change works, we can test the modified `train.py` script by running it with a sample dataset. We can also verify that the CDN is being used for downloading dataset files by checking the network traffic using a tool like `tcpdump` or `Wireshark`. Additionally, we can verify that the studio reuse and idle timeout mechanisms are working correctly by checking the Lightning Studio logs and monitoring the training process.
