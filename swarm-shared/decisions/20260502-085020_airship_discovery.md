# airship / discovery

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can ship in <2h is to optimize the Surrogate AI service's dataset ingestion process by utilizing the HF CDN bypass technique. This involves pre-listing file paths once, embedding them in the training script, and using the CDN to download dataset files without hitting the API rate limit.

### Implementation Plan
1. **Update the dataset ingestion script**:
	* Use the `list_repo_tree` API call to retrieve the list of files in the dataset repository.
	* Save the list of files to a JSON file.
	* Embed the JSON file in the training script.
2. **Modify the training script**:
	* Use the embedded JSON file to download dataset files from the HF CDN.
	* Ensure that the training script uses the CDN URLs to download files, bypassing the API rate limit.
3. **Test the updated ingestion process**:
	* Verify that the dataset files are being downloaded correctly from the HF CDN.
	* Monitor the API rate limit to ensure that it is not being exceeded.

### Code Snippets
```bash
# Update the dataset ingestion script
python scripts/ingest_dataset.py --repo <repo_name> --path <path_to_dataset>

# Modify the training script
python scripts/train.py --dataset <dataset_name> --cdn_url <cdn_url>
```

```python
# ingest_dataset.py
import json
import requests

def list_repo_files(repo_name, path):
    url = f"https://huggingface.co/{repo_name}/resolve/main/{path}"
    response = requests.get(url)
    files = response.json()
    return files

def save_files_to_json(files, json_file):
    with open(json_file, "w") as f:
        json.dump(files, f)

# Usage
repo_name = "<repo_name>"
path = "<path_to_dataset>"
json_file = "files.json"
files = list_repo_files(repo_name, path)
save_files_to_json(files, json_file)
```

```python
# train.py
import json
import requests

def load_json_file(json_file):
    with open(json_file, "r") as f:
        files = json.load(f)
    return files

def download_files_from_cdn(files, cdn_url):
    for file in files:
        url = f"{cdn_url}/{file}"
        response = requests.get(url)
        # Process the downloaded file

# Usage
json_file = "files.json"
cdn_url = "<cdn_url>"
files = load_json_file(json_file)
download_files_from_cdn(files, cdn_url)
```
This implementation plan and code snippets provide a starting point for optimizing the Surrogate AI service's dataset ingestion process using the HF CDN bypass technique.
