# workio / discovery

### High-Value Incremental Improvement for Workio Discovery
#### Diagnosis
The Workio project requires enhancements in its discovery process to improve the overall system's functionality, efficiency, and user experience. Based on the patterns and lessons learned, the highest-value incremental improvement that can be shipped in <2h is to implement a more efficient data ingestion pipeline.

#### Implementation Plan
1. **Optimize Data Ingestion**: Modify the data ingestion script to use the HF CDN bypass pattern, which allows downloading public dataset files without authorization headers, thus bypassing the API rate limit.
2. **Pre-list File Paths**: Implement the pre-list file paths pattern to embed the list of file paths in the training script, reducing the number of API calls during data loading.
3. **Studio Reuse**: Apply the studio reuse pattern to reuse existing Lightning Studios instead of recreating them, saving 80hr/mo quota.

#### Code Snippets
```bash
# Pre-list file paths and embed in training script
list_repo_tree=$(hf api list-repo-tree --path datasets/{repo} --recursive=False)
echo "$list_repo_tree" > file_list.json

# Modify train.py to use CDN-only fetches with zero API calls during data load
import json
with open('file_list.json') as f:
    file_list = json.load(f)

# Use file_list to download dataset files from CDN
for file in file_list:
    file_path = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
    # Download file from CDN
```

```python
# Studio reuse
import lightning as L

# List existing studios
studios = L.Teamspace.studios()

# Reuse existing studio or create a new one
for studio in studios:
    if studio.name == "workio-studio" and studio.status == "Running":
        studio_to_use = studio
        break
else:
    studio_to_use = L.Studio(create_ok=True)

# Use the reused or created studio for training
```
#### Expected Outcome
The implementation of these patterns is expected to improve the efficiency and scalability of the Workio discovery process, reducing the time spent on data ingestion and studio creation. This will enable faster development and deployment of new features, ultimately enhancing the overall user experience.
