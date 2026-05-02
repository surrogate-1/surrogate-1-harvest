# workio / discovery

### Synthesized High-Value Incremental Improvement for Workio Discovery

#### Diagnosis
The Workio project requires enhancements in its discovery process to improve the overall system's functionality, efficiency, and user experience. Based on the patterns and lessons learned, the highest-value incremental improvement that can be shipped in under 2 hours is to implement a more efficient data ingestion process for the system.

#### Implementation Plan
To achieve this, we will focus on optimizing the data ingestion pipeline by leveraging the HF CDN bypass pattern and implementing studio reuse. The plan involves the following steps:

1. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list to a JSON file.
2. **Embed file list in training script**: Modify the training script to read the pre-listed file paths from the JSON file and use them for data loading.
3. **Use CDN-only fetches**: Update the data loading process to use CDN-only fetches with zero API calls during data load.
4. **Studio reuse**: Implement studio reuse instead of recreation to save Lightning 80hr/mo quota when iterating training scripts.

#### Code Snippets
```bash
# Pre-list file paths
curl -X GET \
https://huggingface.co/api/v1/datasets/{repo}/tree/main/{date_folder} \
-H 'Authorization: Bearer {token}' \
-H 'Content-Type: application/json' > file_paths.json

# Download dataset files directly from CDN
for file in $(jq -r '.[] | .path' file_paths.json); do
curl -X GET \
https://huggingface.co/datasets/{repo}/resolve/main/$file \
-o $file
done
```

```python
# Embed file list in training script
import json
with open('file_paths.json') as f:
file_list = json.load(f)
# Use CDN-only fetches for file in file_list:
file_path = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
# Load data from file_path

# Studio reuse in Lightning
import lightning as L
# List existing studios
studios = L.Teamspace("your-team-space").studios
# Reuse existing studio if available
for studio in studios:
if studio.name == "your-studio-name" and studio.status == "Running":
# Use existing studio
studio = studio
break
else:
# Create new studio if none exists
studio = L.Studio(
name="your-studio-name",
cluster=L.Cluster(
cloud_compute=L.CloudCompute("your-cloud-provider"),
container=L.Container(
image="your-docker-image",
command=["your-command"],
),
),
)
```

#### Expected Outcome
By implementing this optimization, we can reduce the number of API calls, avoid rate limits, and improve the overall efficiency of the data ingestion process. Additionally, studio reuse will result in cost savings due to reduced Lightning quota usage. This will have a positive impact on the system's performance and user experience, enhancing the overall functionality of the Workio system.
