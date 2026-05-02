# airship / discovery

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Update training script**: Modify the training script to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the dataset.
3. **Embed file list in training script**: Save the list of file paths to a JSON file and embed it in the training script.
4. **Use CDN-only fetches**: Update the training script to use CDN-only fetches with zero API calls during data load.

### Code Snippets
```bash
# Pre-list file paths
repo="my-repo"
path="my-path"
file_list=$(curl -X GET "https://huggingface.co/api/v1/datasets/${repo}/tree/${path}" | jq -r '.files[] | .path')

# Save file list to JSON
echo "${file_list}" > file_list.json

# Embed file list in training script
train.py:
import json

with open('file_list.json') as f:
    file_list = json.load(f)

# Use CDN-only fetches
for file in file_list:
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
    # Download file from CDN
    response = requests.get(url)
    # Process file
```
### Expected Outcome
By implementing the HF CDN Bypass pattern, we can avoid rate-limit blocks during dataset training and improve the overall efficiency of the training process. This incremental improvement can be shipped in <2h and has a high potential impact on the project's performance.
