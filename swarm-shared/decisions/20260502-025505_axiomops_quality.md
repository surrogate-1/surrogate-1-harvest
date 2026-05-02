# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can be shipped in under 2 hours is to implement a fix for the HF API rate limit issue. This can be achieved by utilizing the HF CDN bypass pattern to download public dataset files without hitting the API rate limit.

### Implementation Plan
1. **Identify the dataset files to download**: Use the `list_repo_tree` API call to retrieve the list of files in the desired repository and date folder.
2. **Save the file list to a JSON file**: Store the list of files in a JSON file to be used in the training script.
3. **Modify the training script to use the CDN bypass**: Update the training script to download the dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
4. **Test the modified training script**: Verify that the training script can successfully download the dataset files using the CDN bypass and train the model without hitting the API rate limit.

### Code Snippets
```bash
# List repository files using list_repo_tree API call
repo_files=$(curl -X GET \
  https://huggingface.co/api/v1/datasets/{repo}/list_repo_tree \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json' \
  -d '{"path": "{date_folder}", "recursive": false}')

# Save the file list to a JSON file
echo "$repo_files" > file_list.json
```

```python
# Modified training script to use CDN bypass
import json
import requests

# Load the file list from the JSON file
with open('file_list.json', 'r') as f:
    file_list = json.load(f)

# Download dataset files from HF CDN
for file in file_list:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file['path']}"
    response = requests.get(file_url)
    with open(file['path'], 'wb') as f:
        f.write(response.content)

# Train the model using the downloaded dataset files
# ...
```
This implementation plan and code snippets should allow for a quick and effective fix to the HF API rate limit issue, enabling the training script to download dataset files without hitting the rate limit.
