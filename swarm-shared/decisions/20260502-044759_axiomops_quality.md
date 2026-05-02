# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the dataset repository**: Determine the Hugging Face dataset repository that is being used for training.
2. **Get the list of file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list of file paths to a JSON file.
3. **Embed the file list in the training script**: Modify the training script to read the list of file paths from the JSON file and use the CDN URLs to download the files.
4. **Use CDN URLs for dataset download**: Update the training script to use the CDN URLs (`https://huggingface.co/datasets/{repo}/resolve/main/{path}`) to download the dataset files, bypassing the API rate-limit checks.

### Code Snippets
```bash
# Get the list of file paths
curl -X GET \
  https://huggingface.co/datasets/{repo}/tree/main/{date_folder} \
  -H 'Authorization: Bearer {token}' \
  -o file_paths.json
```

```python
# Embed the file list in the training script
import json

with open('file_paths.json') as f:
    file_paths = json.load(f)

# Use CDN URLs for dataset download
cdn_url = 'https://huggingface.co/datasets/{repo}/resolve/main/{path}'
dataset_files = [cdn_url.format(repo='{repo}', path=path) for path in file_paths]
```

### Benefits
This improvement will allow the training script to download dataset files without being blocked by API rate-limit checks, reducing the overall training time and improving the efficiency of the Surrogate System.
