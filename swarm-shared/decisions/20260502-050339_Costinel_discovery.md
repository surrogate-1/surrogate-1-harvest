# Costinel / discovery

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files.

### Implementation Plan
1. **Identify dataset files**: Pre-list file paths once using a single API call to `list_repo_tree(path, recursive=False)` for one date folder.
2. **Save file list to JSON**: Embed the list of file paths in a JSON file.
3. **Modify training script**: Update the training script to use the CDN-only fetches with zero API calls during data load.
4. **Use CDN URL**: Use the CDN URL `https://huggingface.co/datasets/{repo}/resolve/main/{path}` to download dataset files without authorization headers.

### Code Snippets
```bash
# Pre-list file paths using a single API call
list_repo_tree.py
```

```python
import json
import requests

# Save file list to JSON
def save_file_list(repo, path, file_list):
    with open('file_list.json', 'w') as f:
        json.dump(file_list, f)

# Load file list from JSON
def load_file_list():
    with open('file_list.json', 'r') as f:
        return json.load(f)

# Modify training script to use CDN-only fetches
def download_dataset_files(repo, path):
    file_list = load_file_list()
    for file in file_list:
        url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}/{file}"
        response = requests.get(url)
        # Save file to local directory
        with open(file, 'wb') as f:
            f.write(response.content)
```

### Example Use Case
To download dataset files using the CDN bypass, run the following command:
```bash
python download_dataset_files.py --repo <repo_name> --path <path_to_dataset>
```
This will download the dataset files using the CDN URL without hitting the API rate limit.
