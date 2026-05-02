# axiomops / quality

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in under 2 hours is to implement a fix for the HF API rate limit issue. This issue is causing problems with dataset training and can be resolved by bypassing the API rate limit entirely by downloading public dataset files from the HF CDN.

### Implementation Plan
1. **Identify the affected code**: Locate the code that is responsible for downloading dataset files from the HF API.
2. **Modify the code to use HF CDN**: Update the code to download public dataset files from the HF CDN instead of the HF API.
3. **Use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern**: Modify the code to use this URL pattern to download dataset files from the HF CDN.
4. **Remove API rate limit checks**: Remove any code that checks for API rate limits, as these are no longer necessary when using the HF CDN.
5. **Test the updated code**: Test the updated code to ensure that it is working correctly and that dataset files are being downloaded successfully from the HF CDN.

### Code Snippet
```python
import requests

def download_dataset_file(repo, path):
    # Use the HF CDN URL pattern to download the dataset file
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    if response.status_code == 200:
        # Save the downloaded file to disk
        with open(path, "wb") as f:
            f.write(response.content)
    else:
        # Handle any errors that occur during the download
        print(f"Error downloading dataset file: {response.status_code}")

# Example usage:
download_dataset_file("my-repo", "my-dataset-file.parquet")
```
This code snippet demonstrates how to download a dataset file from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern. The `download_dataset_file` function takes the repository name and file path as input, downloads the file from the HF CDN, and saves it to disk.
