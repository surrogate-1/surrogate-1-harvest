# Costinel / backend

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can be shipped in under 2 hours is to implement a fix for the HF API rate limit issue. This can be achieved by downloading dataset files directly from the HF CDN, bypassing the API rate limit.

### Implementation Plan
1. **Identify the dataset files to download**: Use the `list_repo_tree` API call to retrieve a list of files in the dataset repository.
2. **Download files from HF CDN**: Use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern to download the files directly from the CDN.
3. **Update the training script**: Modify the training script to use the downloaded files instead of relying on the HF API.

### Code Snippet
```python
import requests

# Define the repository and file path
repo = "dataset/repo"
file_path = "path/to/file"

# Download the file from the HF CDN
url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
response = requests.get(url)

# Save the file to a local directory
with open(f"{file_path}", "wb") as f:
    f.write(response.content)
```
### Benefits
This improvement will allow the training pipeline to bypass the HF API rate limit, reducing the likelihood of rate limit errors and improving the overall efficiency of the pipeline.

### Estimated Time to Ship
This improvement can be shipped in under 2 hours, as it only requires modifying the training script to download files from the HF CDN instead of relying on the HF API.
