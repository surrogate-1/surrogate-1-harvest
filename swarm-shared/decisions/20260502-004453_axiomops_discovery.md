# axiomops / discovery

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify Dataset Repositories**: List the Hugging Face dataset repositories used in the AxiomOps project.
2. **Update Training Scripts**: Modify the training scripts to use the HF CDN Bypass pattern by downloading dataset files directly from the CDN instead of using the Hugging Face API.
3. **Implement CDN Download**: Use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern to download dataset files without requiring authentication headers.
4. **Embed File List in Training Script**: Pre-list file paths once and embed the list in the training script to avoid API calls during data loading.
5. **Test and Verify**: Test the updated training scripts to ensure they can download dataset files successfully using the HF CDN Bypass pattern.

### Code Snippet
```python
import requests

# Define the dataset repository and file path
repo = "dataset-repo"
file_path = "path/to/file.parquet"

# Download the file directly from the CDN
url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
response = requests.get(url)

# Save the file to a local directory
with open(f"{file_path}", "wb") as f:
    f.write(response.content)
```
### Example Use Case
To use the HF CDN Bypass pattern in a training script, simply replace the existing dataset loading code with the following example:
```python
# Load dataset files using HF CDN Bypass
file_list = ["file1.parquet", "file2.parquet", "file3.parquet"]
for file in file_list:
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
    response = requests.get(url)
    with open(f"{file}", "wb") as f:
        f.write(response.content)

# Train the model using the downloaded dataset files
# ...
```
This implementation plan and code snippet demonstrate how to apply the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training in the AxiomOps project.
