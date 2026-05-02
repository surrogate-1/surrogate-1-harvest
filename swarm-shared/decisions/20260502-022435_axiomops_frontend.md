# axiomops / frontend

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can ship in <2h is to optimize the frontend of the AxiomOps platform by implementing a more efficient data loading mechanism.

### Implementation Plan
The implementation plan involves the following steps:

1. **Review existing data loading mechanism**: Review the current data loading mechanism used in the frontend of the AxiomOps platform.
2. **Implement CDN bypass**: Implement the CDN bypass mechanism to download public dataset files from `https://huggingface.co/datasets/{repo}/resolve/main/{path}` without using the HF API, which is rate-limited.
3. **Pre-list file paths**: Pre-list file paths once and embed them in the training script to avoid making API calls during data loading.
4. **Use Lightning Studio reuse**: Reuse existing Lightning Studio instances instead of recreating them to save 80hr/mo quota.

### Code Snippets
```bash
# Pre-list file paths and save to JSON
list_repo_tree=$(curl -X GET "https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=false")
echo "$list_repo_tree" > file_paths.json
```

```python
# Load file paths from JSON and use CDN bypass
import json

with open('file_paths.json') as f:
    file_paths = json.load(f)

# Use CDN bypass to download files
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    # Download file using CDN bypass
    response = requests.get(file_url)
    # Process downloaded file
```

```python
# Reuse existing Lightning Studio instances
import lightning as L

# List existing studios
studios = L.Teamspace.studios

# Reuse existing studio if it exists
for studio in studios:
    if studio.name == "axiomops" and studio.status == "Running":
        # Reuse existing studio
        studio_id = studio.id
        break
else:
    # Create new studio if it doesn't exist
    studio_id = L.Studio.create("axiomops")
```

### Estimated Time to Ship
The estimated time to ship this improvement is <2h, as it involves reviewing existing code, implementing a new data loading mechanism, and reusing existing Lightning Studio instances.
