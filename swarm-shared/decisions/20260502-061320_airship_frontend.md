# airship / frontend

**HF CDN Bypass Implementation**
================================

**Task:** Implement the HF CDN Bypass to avoid Hugging Face API rate limits during data ingestion.

**Highest-Value Incremental Improvement:**

*   **Bypass HF API rate limits** by downloading public dataset files directly from the Hugging Face CDN.

**Implementation Plan:**

1.  **Update `dataset-mirror` script** to use the HF CDN URL for downloading dataset files:
    *   Replace `hf_hub_download` with the CDN URL: `https://huggingface.co/datasets/{repo}/resolve/main/{path}`
    *   Remove Authorization header to bypass API rate limits
2.  **Embed file list in training script**:
    *   Use a single API call from Mac (after rate-limit window clears) to `list_repo_tree(path, recursive=False)` for one date folder
    *   Save list to JSON and embed in train.py
3.  **Lightning training**:
    *   Use CDN-only fetches with zero API calls during data load

**Code Snippets:**

*   **Updated `dataset-mirror` script**:
    ```bash
#!/bin/bash

# ...

# Download dataset files from HF CDN
for file in $(curl -s https://huggingface.co/datasets/${repo}/resolve/main/${path} | jq -r '.[] | @uri'); do
    echo "Downloading ${file}..."
    curl -s -o ${file} ${file}
done
```
*   **Embedded file list in training script**:
    ```python
import json

# Load file list from JSON
with open('file_list.json', 'r') as f:
    file_list = json.load(f)

# Use file list for data loading
data = []
for file in file_list:
    data.append(torch.load(file))
```
*   **Lightning training**:
    ```python
# Use CDN-only fetches with zero API calls during data load
data = DataModule.from_cdn(repo, path)
```
**Estimated Time to Complete:** < 2 hours

**Tags:** #huggingface #cdn #rate-limit-bypass #training
