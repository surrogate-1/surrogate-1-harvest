# airship / frontend

**HF CDN Bypass Implementation**
================================

**Task:** Implement the HF CDN Bypass to avoid Hugging Face API rate limits during data ingestion.

**Highest-Value Incremental Improvement:** Bypass HF API rate limits by downloading public dataset files from the CDN.

**Implementation Plan:**

1. **Identify Public Dataset Files:**
   - Use the `list_repo_tree` API to get a list of files in the dataset repository.
   - Filter out files that are not publicly accessible (i.e., files that require authentication).

2. **Download Files from CDN:**
   - Use the `hf_hub_download` function to download files from the CDN.
   - Specify the `path` parameter to download files from the CDN directly.

3. **Embed File List in Training Script:**
   - Save the list of files to a JSON file.
   - Embed the JSON file in the training script.

**Code Snippets:**

```python
import os
import json
from huggingface_hub import hf_hub_download

# Identify public dataset files
repo_id = "your-repo-id"
path = "your-path"
files = hf_hub_download(repo_id, path, recursive=False)

# Download files from CDN
cdn_files = []
for file in files:
    cdn_file = hf_hub_download(repo_id, file, path, from_cache=False)
    cdn_files.append(cdn_file)

# Save file list to JSON
with open("file_list.json", "w") as f:
    json.dump(cdn_files, f)

# Embed file list in training script
with open("train.py", "r") as f:
    train_script = f.read()

with open("train.py", "w") as f:
    f.write(train_script + "\n" + json.dumps(cdn_files))
```

**Implementation Timeline:** 1 hour

**Notes:**

* This implementation assumes that the dataset repository is publicly accessible.
* The `hf_hub_download` function is used to download files from the CDN.
* The file list is saved to a JSON file and embedded in the training script.
* This implementation bypasses the HF API rate limits by downloading files from the CDN directly.
