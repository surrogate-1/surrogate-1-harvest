# axiomops / discovery

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the dataset repository**: Determine the repository containing the dataset to be used for training.
2. **Get the list of file paths**: Use the `list_repo_tree` API to get the list of file paths for the dataset repository. This can be done using a single API call from the Mac.
3. **Save the list to a JSON file**: Save the list of file paths to a JSON file.
4. **Embed the JSON file in the training script**: Embed the JSON file in the training script to allow for CDN-only fetches with zero API calls during data load.
5. **Use the CDN URL**: Use the CDN URL (`https://huggingface.co/datasets/{repo}/resolve/main/{path}`) to download the dataset files without authorization headers.

### Code Snippets
```bash
# Get the list of file paths using list_repo_tree API
repo_tree=$(curl -X GET \
  https://huggingface.co/api/v1/datasets/{repo}/tree \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json')

# Save the list to a JSON file
echo "$repo_tree" > file_paths.json
```

```python
# Embed the JSON file in the training script
import json

with open('file_paths.json') as f:
    file_paths = json.load(f)

# Use the CDN URL to download the dataset files
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    # Download the file using the CDN URL
    response = requests.get(file_url)
    # Process the downloaded file
```

### Benefits
The HF CDN Bypass pattern allows for faster dataset training by avoiding rate-limit blocks and reducing the number of API calls. This improvement can be shipped in under 2 hours and has a significant impact on the project's functionality and efficiency.
