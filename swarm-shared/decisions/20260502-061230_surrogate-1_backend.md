# surrogate-1 / backend

**Diagnosis**
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* There is inadequate reuse of existing Lightning Studio instances, leading to wasted quota and potential downtime.
* The project does not leverage the Hugging Face CDN to bypass API rate limits during dataset training.
* The existing implementation does not properly handle file paths and schema for dataset ingestion.

**Proposed change**
* Implement a robust Hugging Face API rate limit handling mechanism to prevent blocked dataset training.

**Implementation**
```markdown
### Step 1: Update `train.py` to use Hugging Face CDN for dataset file paths
Update the `train.py` file to use the Hugging Face CDN for dataset file paths, leveraging the `list_repo_tree` API to retrieve a list of file paths and then downloading the files directly from the CDN using the `hf_hub_download` function.

```python
import os
import requests
from huggingface_hub import hf_hub_download

# ...

# Use Hugging Face CDN for dataset file paths
file_paths = requests.get(f"https://huggingface.co/datasets/{repo}/resolve/main/{path}").json()
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    hf_hub_download(file_url, filename=os.path.basename(file_path))
```

### Step 2: Implement rate limit handling for Hugging Face API
Implement a rate limit handling mechanism to prevent blocked dataset training. This can be achieved by using a retry mechanism with exponential backoff to handle API rate limits.

```python
import time
import requests

def retry_api_call(func, *args, **kwargs):
    max_retries = 5
    retry_delay = 1
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                raise
```

### Step 3: Update `dataset-mirror` script to use Hugging Face CDN for dataset file paths
Update the `dataset-mirror` script to use the Hugging Face CDN for dataset file paths, leveraging the `list_repo_tree` API to retrieve a list of file paths and then downloading the files directly from the CDN using the `hf_hub_download` function.

```python
import os
import requests
from huggingface_hub import hf_hub_download

# ...

# Use Hugging Face CDN for dataset file paths
file_paths = requests.get(f"https://huggingface.co/datasets/{repo}/resolve/main/{path}").json()
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    hf_hub_download(file_url, filename=os.path.basename(file_path))
```

**Verification**
* Verify that the Hugging Face API rate limit handling mechanism is working correctly by checking the API response status code and retrying the API call with exponential backoff.
* Verify that the dataset training is not blocked by API rate limits by checking the training logs and ensuring that the training process completes successfully.
* Verify that the dataset file paths are being downloaded correctly from the Hugging Face CDN by checking the file sizes and contents.
