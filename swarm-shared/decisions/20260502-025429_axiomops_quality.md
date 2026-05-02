# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Update training script**: Modify the training script to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern, bypassing the API rate limit.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the dataset, and save the list to a JSON file.
3. **Embed file list in training script**: Update the training script to read the file list from the JSON file and use it to download the dataset files from the HF CDN.

### Code Snippets
```bash
# Pre-list file paths and save to JSON file
curl -X GET \
  https://huggingface.co/api/v1/datasets/{repo}/tree/main/{path} \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  > file_list.json
```

```python
# Embed file list in training script
import json

with open('file_list.json') as f:
    file_list = json.load(f)

# Download dataset files from HF CDN
for file in file_list:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file['path']}"
    response = requests.get(file_url)
    with open(file['path'], 'wb') as f:
        f.write(response.content)
```

### Expected Outcome
By implementing the HF CDN Bypass pattern, we can avoid API rate-limit blocks during dataset training, reducing the likelihood of training interruptions and improving overall system reliability.
