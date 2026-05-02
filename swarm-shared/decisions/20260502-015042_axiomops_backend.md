# axiomops / backend

### Implementing HF CDN Bypass Pattern for AxiomOps Project
#### Overview
The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern. This involves modifying the dataset ingestion script to download files directly from the Hugging Face CDN, bypassing the API rate limit.

#### Implementation Plan
1. **Identify the dataset ingestion script**: Locate the script responsible for downloading datasets from Hugging Face.
2. **Modify the script to use CDN URLs**: Update the script to construct CDN URLs for dataset files using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` pattern.
3. **Remove API calls for file downloads**: Remove any API calls used to download dataset files, replacing them with direct CDN downloads.
4. **Test the modified script**: Verify that the modified script can successfully download dataset files from the CDN without hitting the API rate limit.

#### Code Snippets
```python
import requests

# Define the dataset repository and file path
repo = "axentx/dataset"
file_path = "data/train.parquet"

# Construct the CDN URL
cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"

# Download the file from the CDN
response = requests.get(cdn_url)
with open(file_path, "wb") as f:
    f.write(response.content)
```

#### Example Use Case
To apply this pattern to the AxiomOps project, modify the `scripts/ingest_dataset.sh` script to use the CDN URL pattern. For example:
```bash
#!/bin/bash

# Define the dataset repository and file path
repo="axentx/dataset"
file_path="data/train.parquet"

# Construct the CDN URL
cdn_url="https://huggingface.co/datasets/${repo}/resolve/main/${file_path}"

# Download the file from the CDN
curl -o "${file_path}" "${cdn_url}"
```
By implementing the HF CDN Bypass pattern, the AxiomOps project can avoid API rate limits and improve dataset ingestion efficiency. This change can be shipped in under 2 hours, providing a high-value incremental improvement to the project.
