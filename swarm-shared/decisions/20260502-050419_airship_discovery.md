# airship / discovery

### High-Value Incremental Improvement: Implementing HF CDN Bypass for Faster Data Ingestion
#### Problem Statement
The current data ingestion pipeline in Airship is limited by Hugging Face API rate limits, causing delays in training and deployment of Surrogate AI models.

#### Solution Overview
To bypass the Hugging Face API rate limits, we will utilize the HF CDN (Content Delivery Network) to download dataset files directly. This approach eliminates the need for API calls during data loading, significantly reducing the ingestion time.

#### Implementation Plan

1. **Identify Dataset Files**: Pre-list file paths once using a single API call to `list_repo_tree(path, recursive=False)` for one date folder. Save the list to a JSON file.
2. **Embed File List in Training Script**: Modify the `train.py` script to embed the pre-listed file paths. This allows Lightning training to fetch files directly from the HF CDN without making API calls.
3. **Update Ingestion Pipeline**: Modify the ingestion pipeline to use the HF CDN for downloading dataset files. This can be achieved by constructing the CDN URL for each file using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` pattern.

#### Code Snippets

```python
import json
import requests

# Pre-list file paths using a single API call
def pre_list_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")
    file_paths = response.json()["files"]
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# Embed file list in training script
def embed_file_list_in_train_script(file_paths):
    with open("train.py", "r+") as f:
        content = f.read()
        f.seek(0)
        f.write(f"file_paths = {file_paths}\n" + content)

# Update ingestion pipeline to use HF CDN
def update_ingestion_pipeline(file_paths):
    for file_path in file_paths:
        cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
        response = requests.get(cdn_url)
        # Process the downloaded file
```

#### Example Use Case
To demonstrate the implementation, let's assume we have a dataset repository `my-dataset` with a file `data.parquet` located in the `data` folder. We can pre-list the file paths using the `pre_list_file_paths` function:
```python
pre_list_file_paths("my-dataset", "data")
```
This will save the file paths to a JSON file `file_paths.json`. We can then embed the file list in the `train.py` script using the `embed_file_list_in_train_script` function:
```python
embed_file_list_in_train_script(json.load(open("file_paths.json", "r")))
```
Finally, we can update the ingestion pipeline to use the HF CDN by calling the `update_ingestion_pipeline` function:
```python
update_ingestion_pipeline(json.load(open("file_paths.json", "r")))
```
This will download the `data.parquet` file directly from the HF CDN, bypassing the API rate limits.

#### Time Estimate
The implementation of the HF CDN bypass is estimated to take less than 2 hours, as it involves modifying existing scripts and pipelines. The actual time may vary depending on the complexity of the ingestion pipeline and the number of dataset files involved.
