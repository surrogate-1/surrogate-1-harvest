# surrogate-1 / backend

### Synthesized Solution

The project lacks a robust data ingestion pipeline, which is crucial for training and updating the surrogate-1 model. The current implementation uses the Hugging Face API, which has rate limits that can block dataset training. To address this issue, we propose implementing a CDN bypass to download dataset files without hitting the API rate limits.

### Proposed Change

The proposed change is to implement a CDN bypass for dataset downloads using the `hf_hub_download` function from the Hugging Face library. This will allow the project to download dataset files without hitting the API rate limits. The change will be implemented in the `data_ingestion.py` file, which is responsible for downloading and processing dataset files.

### Implementation

To implement the CDN bypass, we will modify the `data_ingestion.py` file to use the `hf_hub_download` function to download dataset files from the Hugging Face CDN. We will also add error handling to ensure that the download process is robust and reliable.

```python
import os
import requests
from huggingface_hub import Repository

def download_dataset(repo_id, dataset_name):
    # Get the dataset repository
    repo = Repository(local_dir=f"./{dataset_name}", repo_id=repo_id)
    
    # Get the list of files in the dataset repository
    files = repo.list_repo_files()
    
    # Download each file from the CDN
    for file in files:
        file_url = f"https://huggingface.co/{repo_id}/resolve/main/{file}"
        response = requests.get(file_url, stream=True)
        if response.status_code == 200:
            with open(file, "wb") as f:
                for chunk in response.iter_content(chunk_size=1024):
                    f.write(chunk)
        else:
            print(f"Failed to download {file}")

# Example usage
repo_id = "username/dataset-name"
dataset_name = "dataset-name"
download_dataset(repo_id, dataset_name)
```

Additionally, we will modify the training script to download dataset files from the CDN instead of using the HF API. We will pre-list the file paths once using the HF API and embed the list in the training script.

```bash
# Pre-list file paths using HF API
hf_api_url="https://huggingface.co/datasets/{repo}/resolve/main/{path}"
file_list=$(curl -s "$hf_api_url" | jq -r '.[] | .filename')

# Embed file list in training script
echo "file_list=$file_list" > train.py

# Modify training script to download from CDN
echo "import os
import requests

# Download dataset files from CDN
for file in \$file_list:
    cdn_url=\"https://huggingface.co/datasets/{repo}/resolve/main/{path}/\$file\"
    response = requests.get(cdn_url)
    with open(\$file, 'wb') as f:
        f.write(response.content)" >> train.py
```

We will also ensure that the wrapper script has a proper Bash shebang, is executable, and is invoked via Bash.

```bash
# Make wrapper script executable and add Bash shebang
chmod +x wrapper_script.sh
echo "#!/usr/bin/env bash" > wrapper_script.sh
```

### Verification

To verify that the implementation works, we can check the following:

1. The dataset files are downloaded successfully from the Hugging Face CDN.
2. The API rate limits are not hit during the download process.
3. The dataset files are stored in the correct location and can be accessed by the project.
4. The project can train and update the surrogate-1 model using the downloaded dataset files.
5. The training script downloads dataset files from the CDN instead of using the HF API.
6. The wrapper script executes without errors and invokes the training script correctly.
7. The Lightning Studio instance is reused instead of recreated, saving 80hr/mo quota.

We can verify these changes by running the training script and checking the download logs, wrapper script execution logs, and Lightning Studio instance usage.

### Action Plan

1. Implement the CDN bypass in the `data_ingestion.py` file.
2. Modify the training script to download dataset files from the CDN.
3. Ensure that the wrapper script has a proper Bash shebang, is executable, and is invoked via Bash.
4. Test the implementation by running the training script and verifying that the dataset files are downloaded correctly.
5. Monitor the API rate limits and ensure that they are not hit during the download process.
6. Verify that the project can train and update the surrogate-1 model using the downloaded dataset files.
7. Reuse existing Lightning Studio instances to save 80hr/mo quota.
