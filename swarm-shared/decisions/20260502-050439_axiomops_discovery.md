# axiomops / discovery

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training. This involves pre-listing file paths once, embedding them in the training script, and using the CDN to download dataset files without API calls.

### Implementation Plan
1. **Identify the dataset repository**: Determine the Hugging Face dataset repository that needs to be used for training.
2. **List file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list of file paths to a JSON file.
3. **Embed file paths in training script**: Modify the training script to read the list of file paths from the JSON file and use the CDN to download the dataset files.
4. **Update the training script**: Update the training script to use the CDN to download dataset files without making API calls.

### Code Snippets
```bash
# List file paths
curl -X GET \
  https://huggingface.co/datasets/{repo}/tree/main/{date} \
  -H 'Authorization: Bearer {token}' \
  -o file_paths.json
```

```python
# Embed file paths in training script
import json

with open('file_paths.json') as f:
    file_paths = json.load(f)

# Use CDN to download dataset files
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    # Download file using CDN
    response = requests.get(file_url)
    with open(file_path, 'wb') as f:
        f.write(response.content)
```

### Benefits
The HF CDN Bypass pattern provides several benefits, including:

* Avoids rate-limit blocks during dataset training
* Reduces the number of API calls made during training
* Improves training performance by using the CDN to download dataset files

### Tags
#huggingface #cdn #rate-limit-bypass #training
