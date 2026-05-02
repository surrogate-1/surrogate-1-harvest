# axiomops / discovery

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the dataset repository**: Determine the repository containing the dataset to be used for training.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list of file paths to a JSON file.
3. **Embed file list in training script**: Modify the training script to read the file list from the JSON file and use it to download the dataset files directly from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
4. **Update the training script**: Modify the training script to use the downloaded dataset files instead of relying on the HF API.

### Code Snippets
```bash
# Pre-list file paths
repo="username/repo"
date_folder="2026-04-29"
file_list=$(curl -s -X GET \
  https://huggingface.co/api/v1/datasets/${repo}/tree/${date_folder} \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json')

# Save file list to JSON
echo "${file_list}" > file_list.json
```

```python
# Embed file list in training script
import json

with open('file_list.json') as f:
    file_list = json.load(f)

# Download dataset files from HF CDN
dataset_files = []
for file in file_list:
    file_path = f"https://huggingface.co/datasets/{repo}/resolve/main/{date_folder}/{file['path']}"
    dataset_files.append(file_path)

# Use downloaded dataset files for training
```

### Benefits
Implementing the HF CDN Bypass pattern will allow the training script to download dataset files directly from the HF CDN, avoiding API rate-limit blocks and reducing the risk of training interruptions. This improvement can be shipped in <2h and will have a significant impact on the project's overall performance and reliability.
