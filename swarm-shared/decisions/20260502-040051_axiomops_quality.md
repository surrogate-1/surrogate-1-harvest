# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the dataset repository**: Determine the Hugging Face dataset repository that is being used for training.
2. **Get the list of file paths**: Use the `list_repo_tree` API call to get the list of file paths for the dataset repository. This call should be made only once, after the rate-limit window clears.
3. **Save the list to a JSON file**: Save the list of file paths to a JSON file that can be embedded in the training script.
4. **Modify the training script**: Modify the training script to use the CDN-only fetches with zero API calls during data load. This can be achieved by using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL to download the dataset files.

### Code Snippets
```bash
# Get the list of file paths using list_repo_tree API call
file_paths=$(curl -X GET \
  https://huggingface.co/api/v1/datasets/{repo}/tree \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json')

# Save the list to a JSON file
echo "$file_paths" > file_paths.json
```

```python
# Modify the training script to use CDN-only fetches
import json

# Load the list of file paths from the JSON file
with open('file_paths.json') as f:
    file_paths = json.load(f)

# Use CDN-only fetches to download the dataset files
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    # Download the file using the CDN URL
    response = requests.get(file_url)
    # Process the downloaded file
```

### Benefits
The implementation of the HF CDN Bypass pattern will help avoid API rate-limit blocks during dataset training, allowing for more efficient and uninterrupted training processes. This improvement can be shipped in <2h, making it a high-value incremental improvement for the AxiomOps project.
