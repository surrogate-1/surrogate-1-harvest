# surrogate-1 / backend

### Diagnosis
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* The existing implementation may not be reusing existing Lightning Studio instances efficiently, leading to wasted resources.
* The project does not have a mechanism to bypass the Hugging Face API rate limit for dataset training, which can be achieved by using the HF CDN.

### Proposed change
The proposed change is to implement a mechanism to bypass the Hugging Face API rate limit for dataset training by using the HF CDN. This can be achieved by modifying the `train.py` script to download dataset files directly from the HF CDN instead of using the Hugging Face API.

### Implementation
To implement this change, we need to modify the `train.py` script to use the HF CDN for dataset downloads. We can do this by replacing the `load_dataset` function with a custom function that downloads the dataset files directly from the HF CDN.

```python
import requests
import json

def download_dataset_from_cdn(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    return response.content

def load_dataset(repo, path):
    file_list = []
    response = requests.get(f"https://huggingface.co/datasets/{repo}/resolve/main/")
    for file in response.json():
        if file["type"] == "file":
            file_list.append(file["name"])
    dataset = []
    for file in file_list:
        content = download_dataset_from_cdn(repo, file)
        dataset.append(json.loads(content))
    return dataset

# Usage
repo = "my-repo"
path = "my-path"
dataset = load_dataset(repo, path)
```

We also need to modify the `list_repo_tree` function to use the HF CDN for file listing.

```python
def list_repo_tree(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    return response.json()

# Usage
repo = "my-repo"
path = "my-path"
file_list = list_repo_tree(repo, path)
```

### Verification
To verify that the implementation works, we can test the `load_dataset` and `list_repo_tree` functions with a sample repository and path. We can also check the dataset files downloaded from the HF CDN to ensure they are correct.

```python
repo = "my-repo"
path = "my-path"
dataset = load_dataset(repo, path)
print(dataset)

file_list = list_repo_tree(repo, path)
print(file_list)
```

We can also monitor the Hugging Face API rate limit to ensure that it is not being exceeded. If the rate limit is not being exceeded, it indicates that the implementation is working correctly.
