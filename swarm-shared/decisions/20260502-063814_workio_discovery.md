# workio / discovery

### High-Value Incremental Improvement for Workio
#### Task: Implement HF CDN Bypass for Training Pipeline
#### Time Estimate: 1 hour

### Implementation Plan
#### Step 1: Update Training Script to Use HF CDN Bypass
Update the training script to download dataset files from the HF CDN instead of using the HF API. This can be achieved by modifying the `train.py` script to use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern to download files.

```python
import requests

# Define the repository and file path
repo = "your-repo"
file_path = "your-file-path"

# Construct the CDN URL
cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"

# Download the file from the CDN
response = requests.get(cdn_url)
with open(file_path, "wb") as f:
    f.write(response.content)
```

#### Step 2: Pre-List File Paths and Embed in Training Script
Pre-list the file paths for the dataset using the HF API and embed the list in the training script. This can be achieved by making a single API call to `list_repo_tree` and saving the list to a JSON file.

```python
import json
import requests

# Define the repository and path
repo = "your-repo"
path = "your-path"

# Make the API call to list the file paths
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")

# Save the list to a JSON file
with open("file_paths.json", "w") as f:
    json.dump(response.json(), f)
```

#### Step 3: Update Training Script to Use CDN-Only Fetches
Update the training script to use CDN-only fetches during data loading. This can be achieved by modifying the `train.py` script to use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern to download files.

```python
import json

# Load the pre-listed file paths from the JSON file
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

# Use CDN-only fetches during data loading
for file_path in file_paths:
    # Download the file from the CDN
    response = requests.get(f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}")
    with open(file_path, "wb") as f:
        f.write(response.content)
```

### Code Snippets
```python
# train.py
import requests
import json

# Define the repository and file path
repo = "your-repo"
file_path = "your-file-path"

# Construct the CDN URL
cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"

# Download the file from the CDN
response = requests.get(cdn_url)
with open(file_path, "wb") as f:
    f.write(response.content)

# Load the pre-listed file paths from the JSON file
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

# Use CDN-only fetches during data loading
for file_path in file_paths:
    # Download the file from the CDN
    response = requests.get(f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}")
    with open(file_path, "wb") as f:
        f.write(response.content)
```

```python
# list_file_paths.py
import requests
import json

# Define the repository and path
repo = "your-repo"
path = "your-path"

# Make the API call to list the file paths
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")

# Save the list to a JSON file
with open("file_paths.json", "w") as f:
    json.dump(response.json(), f)
```
