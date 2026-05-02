# axiomops / discovery

### Synthesized Solution

The AxiomOps project is an AI-powered DevOps platform with a surrogate system for autonomous infrastructure management. To improve its functionality and efficiency, the highest-value incremental improvement that can be shipped in under 2 hours is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

#### Proposed Improvement

The proposed improvement involves the following steps:

1. **Update the training script**: Modify the training script to download dataset files from the Hugging Face CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL, which bypasses the API rate limit entirely.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the dataset, and save the list to a JSON file.
3. **Embed file list in training script**: Embed the saved JSON file list in the training script to enable CDN-only fetches with zero API calls during data load.
4. **Implement studio reuse**: Update the code to reuse existing Lightning Studios instead of recreating them to save 80hr/mo quota.

#### Implementation Plan

To implement these improvements, the following steps can be taken:

1. **Update training script**: Modify the training script to use the HF CDN to download dataset files and pre-list file paths.
2. **Implement studio reuse**: Update the code to reuse existing Lightning Studios instead of recreating them.
3. **Test and verify**: Test the updated training script and studio reuse implementation to ensure they are working as expected.

#### Code Snippets

```python
import requests
import json

# Pre-list file paths
repo = "your-repo-name"
path = "your-path"
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")
file_list = response.json()["files"]
with open("file_list.json", "w") as f:
    json.dump(file_list, f)

# Update training script
with open("file_list.json", "r") as f:
    file_list = json.load(f)
for file in file_list:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file['path']}"
    response = requests.get(file_url)
    # Process the downloaded file

# Implement studio reuse
for s in Teamspace.studios:
    if s.name == "X" and s.status == "Running":
        # Reuse existing studio
        use_s = s
```

#### Conclusion

By implementing the proposed improvements, the AxiomOps project can optimize its training pipeline and dataset ingestion process, reducing rate limiting issues and improving overall efficiency. The updated training script and studio reuse implementation can be tested and verified to ensure they are working as expected. This improvement can be shipped in under 2 hours and requires minimal changes to the existing codebase.
