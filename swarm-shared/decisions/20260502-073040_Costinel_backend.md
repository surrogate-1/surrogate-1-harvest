# Costinel / backend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files.

### Implementation Plan
1. **Identify the dataset repository**: Determine the repository containing the dataset files that need to be downloaded.
2. **Get the list of file paths**: Use the `list_repo_tree` API call to get the list of file paths for the dataset repository. This call should be made from the Mac (after the rate-limit window clears) to avoid blocking the training process.
3. **Save the list to a JSON file**: Save the list of file paths to a JSON file that can be embedded in the training script.
4. **Modify the training script**: Modify the training script to use the CDN URLs for downloading dataset files instead of the API. The script should read the list of file paths from the JSON file and use the CDN URLs to download the files.

### Code Snippets
```bash
# Get the list of file paths using the list_repo_tree API call
repo_id="dataset-repo-id"
file_list=$(curl -X GET \
  https://huggingface.co/api/v1/repo/list_repo_tree \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"repo_id": "'$repo_id'", "path": "", "recursive": false}')

# Save the list to a JSON file
echo "$file_list" > file_list.json
```

```python
# Modify the training script to use the CDN URLs
import json

# Load the list of file paths from the JSON file
with open('file_list.json') as f:
    file_list = json.load(f)

# Use the CDN URLs to download the dataset files
for file in file_list:
    file_path = file['path']
    cdn_url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{file_path}"
    # Download the file using the CDN URL
    response = requests.get(cdn_url)
    with open(file_path, 'wb') as f:
        f.write(response.content)
```

### Benefits
This improvement will allow the training process to download dataset files without being blocked by API rate limits, reducing the overall training time and improving the efficiency of the system.
