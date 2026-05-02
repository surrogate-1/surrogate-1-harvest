# axiomops / frontend

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit issue. This issue is currently blocking dataset training and can be resolved by bypassing the API rate limit entirely by downloading public dataset files from the HF CDN.

### Implementation Plan
1. **Update training script**: Modify the training script to download dataset files from the HF CDN instead of using the HF API.
2. **Use CDN URL**: Use the CDN URL format `https://huggingface.co/datasets/{repo}/resolve/main/{path}` to download dataset files.
3. **Remove API calls**: Remove API calls from the training script to avoid rate limit issues.
4. **Test and verify**: Test and verify that the updated training script can download dataset files from the HF CDN without encountering rate limit issues.

### Code Snippet
```python
import requests

# Define the CDN URL format
cdn_url = "https://huggingface.co/datasets/{repo}/resolve/main/{path}"

# Define the repository and path to the dataset file
repo = "your-repo-name"
path = "your-dataset-file-path"

# Construct the CDN URL
url = cdn_url.format(repo=repo, path=path)

# Download the dataset file from the HF CDN
response = requests.get(url)

# Save the dataset file to a local file
with open("dataset_file.parquet", "wb") as f:
    f.write(response.content)
```
This code snippet demonstrates how to download a dataset file from the HF CDN using the `requests` library. The `cdn_url` format is used to construct the URL to the dataset file, and the `requests.get()` method is used to download the file. The downloaded file is then saved to a local file using the `with open()` statement.
