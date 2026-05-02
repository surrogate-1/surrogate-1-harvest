# airship / discovery

### Highest-Value Incremental Improvement
#### Implementing HF CDN Bypass for Faster Data Ingestion
##### Problem Statement
The current data ingestion pipeline in Airship is limited by Hugging Face API rate limits, causing delays in training and model updates.

##### Solution
Implement the HF CDN Bypass pattern to download dataset files directly from the CDN, bypassing the API rate limit.

##### Implementation Plan
1. **Identify dataset repositories**: Determine which dataset repositories are being used in the current pipeline.
2. **Update dataset ingestion script**: Modify the dataset ingestion script to use the HF CDN Bypass pattern.
	* Use `https://huggingface.co/datasets/{repo}/resolve/main/{path}` to download dataset files directly from the CDN.
	* Remove API calls to `list_repo_files` and `load_dataset` with `streaming=True`.
3. **Embed file list in training script**: Pre-list file paths once and embed them in the training script.
	* Use a single API call to `list_repo_tree` with `recursive=False` to get the file list.
	* Save the file list to a JSON file.
	* Update the training script to read the file list from the JSON file.
4. **Test and deploy**: Test the updated dataset ingestion script and training script, then deploy the changes to the production environment.

##### Code Snippets
```bash
# Update dataset ingestion script
wget https://huggingface.co/datasets/{repo}/resolve/main/{path}
```

```python
# Embed file list in training script
import json

with open('file_list.json') as f:
    file_list = json.load(f)

# Use file list in training script
for file in file_list:
    # Download file from CDN
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
    response = requests.get(url)
    # Process file
```

##### Expected Outcome
The HF CDN Bypass implementation will reduce the load on the Hugging Face API, allowing for faster data ingestion and model updates. This will improve the overall performance and efficiency of the Airship platform.
