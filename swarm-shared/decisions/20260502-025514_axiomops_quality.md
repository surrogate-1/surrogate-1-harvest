# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can be shipped in under 2 hours is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files.

### Implementation Plan
1. **Identify the dataset repository and file paths**:
	* Use the `list_repo_tree` API to get the file paths for the desired dataset repository.
	* Save the file paths to a JSON file.
2. **Modify the training script to use CDN downloads**:
	* Update the training script to download dataset files from the CDN using the saved file paths.
	* Use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL format to download files without API rate limits.
3. **Test the modified training script**:
	* Run the modified training script to ensure that it downloads dataset files correctly from the CDN.

### Code Snippets
```bash
# Get file paths for the dataset repository
repo="axentx/dataset"
path="train"
file_paths=$(curl -s -X GET "https://huggingface.co/api/v1/datasets/${repo}/tree?path=${path}&recursive=false" | jq -r '.files[] | .path')

# Save file paths to a JSON file
echo "${file_paths}" > file_paths.json
```

```python
# Modify the training script to use CDN downloads
import json

with open('file_paths.json') as f:
    file_paths = json.load(f)

for file_path in file_paths:
    url = f"https://huggingface.co/datasets/axentx/dataset/resolve/main/{file_path}"
    # Download file from CDN using the URL
    response = requests.get(url)
    with open(file_path, 'wb') as f:
        f.write(response.content)
```

### Estimated Time to Ship
This improvement can be shipped in under 2 hours, as it only requires modifying the training script to use CDN downloads and testing the changes.
