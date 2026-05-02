# Costinel / discovery

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid API rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify the dataset repository**: Determine the repository containing the dataset to be used for training.
2. **Get the list of file paths**: Use the `list_repo_tree` API call to retrieve the list of file paths for the dataset repository. This call should be made from the Mac (after the rate-limit window clears) to avoid blocking the training process.
3. **Save the list to a JSON file**: Save the list of file paths to a JSON file that can be embedded in the training script.
4. **Modify the training script**: Update the training script to use the CDN-only fetches with zero API calls during data load. This can be achieved by using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern to download the dataset files directly from the CDN.

### Code Snippet
```python
import json
import requests

# Get the list of file paths for the dataset repository
repo_name = "your-repo-name"
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo_name}/tree?recursive=False")
file_paths = response.json()

# Save the list to a JSON file
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)

# Modify the training script to use CDN-only fetches
def load_dataset():
    with open("file_paths.json", "r") as f:
        file_paths = json.load(f)
    dataset = []
    for file_path in file_paths:
        url = f"https://huggingface.co/datasets/{repo_name}/resolve/main/{file_path}"
        response = requests.get(url)
        dataset.append(response.content)
    return dataset
```
This implementation plan and code snippet should take less than 2 hours to complete and will provide a significant improvement to the dataset training process by avoiding API rate-limit blocks.
