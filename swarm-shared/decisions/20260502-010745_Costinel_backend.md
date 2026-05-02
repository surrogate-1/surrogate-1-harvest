# Costinel / backend

### Synthesized High-Value Incremental Improvement for Costinel Backend

The proposed improvements can be combined to create a more comprehensive and efficient solution. By implementing the HF CDN bypass for dataset training and integrating knowledge-rag for business research insights, Costinel can improve the overall performance and efficiency of the training process while providing more accurate and contextual recommendations for cost optimization.

#### Combined Implementation Plan

1. **Implement HF CDN Bypass for Dataset Training**:
	* Update the training script to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
	* Pre-list file paths using a single API call to `list_repo_tree(path, recursive=False)` and save the list to a JSON file.
	* Embed the file list in the training script to download the files from the HF CDN without making additional API calls.
2. **Integrate Knowledge-RAG for Business Research Insights**:
	* Review the most-connected hub (e.g., "MOC") to gain a deeper understanding of the current landscape.
	* Execute the `granite-business-research.sh` script to gather market data.
	* Use knowledge-rag to query the top hub and related documents, providing contextual insights for business research.
3. **Combine HF CDN Bypass and Knowledge-RAG**:
	* Utilize the HF CDN bypass to download public dataset files for knowledge-rag training.
	* Integrate knowledge-rag with the HF CDN bypass to provide more accurate and contextual recommendations for cost optimization.

#### Code Snippets

```python
import json
import requests

# Pre-list file paths
repo = "axentx/dataset"
path = "data"
response = requests.get(f"https://huggingface.co/api/repos/{repo}/tree/main/{path}")
file_list = response.json()["files"]
with open("file_list.json", "w") as f:
    json.dump(file_list, f)

# Embed file list in training script
with open("file_list.json", "r") as f:
    file_list = json.load(f)

# Download files from HF CDN
for file in file_list:
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}/{file}"
    response = requests.get(url)
    with open(file, "wb") as f:
        f.write(response.content)

# Execute market analysis script
import subprocess
subprocess.run("./granite-business-research.sh", shell=True)

# Integrate knowledge-rag
import knowledge_rag
knowledge_rag.query("--hub", "MOC", "--related-docs")
```

#### Benefits

The combined implementation will allow Costinel to:

* Download dataset files without being rate-limited by the HF API, improving the overall performance and efficiency of the training process.
* Provide more accurate and contextual recommendations for cost optimization, enabling enterprises to make informed decisions and reduce cloud costs.
* Leverage the knowledge-rag pipeline for business research insights, enhancing the overall value proposition of the Costinel backend.

#### Estimated Time to Ship

The combined implementation can be shipped within a short timeframe, estimated to be < 2 hours, as it builds upon existing patterns and lessons learned, and leverages existing scripts and tools.
