# axiomops / quality

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in <2h is to implement the HF CDN Bypass pattern to avoid API rate limits when downloading dataset files. This can be achieved by modifying the `train.py` script to download files directly from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.

### Implementation Plan
1. **Identify the dataset repository and file paths**:
	* Use the `list_repo_tree` API call to retrieve the file paths for the desired dataset repository.
	* Save the file paths to a JSON file.
2. **Modify the `train.py` script**:
	* Import the `requests` library to download files from the HF CDN.
	* Use the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern to download files directly from the HF CDN.
	* Update the `train.py` script to use the downloaded files instead of relying on the HF API.
3. **Test the modified `train.py` script**:
	* Run the modified `train.py` script to ensure that it can download files from the HF CDN without hitting API rate limits.

### Code Snippets
```python
import requests
import json

# Load file paths from JSON file
with open('file_paths.json', 'r') as f:
    file_paths = json.load(f)

# Download files from HF CDN
for file_path in file_paths:
    url = f'https://huggingface.co/datasets/{repo}/resolve/main/{file_path}'
    response = requests.get(url)
    with open(file_path, 'wb') as f:
        f.write(response.content)
```
Note: Replace `{repo}` with the actual dataset repository name.

### Benefits
The HF CDN Bypass pattern allows for faster and more reliable dataset downloads, avoiding API rate limits and reducing the risk of training pipeline failures. This improvement can be shipped in <2h and has a significant impact on the overall performance and reliability of the AxiomOps platform.
