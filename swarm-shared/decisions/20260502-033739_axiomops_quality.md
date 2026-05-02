# axiomops / quality

**Synthesized Solution: Implementing HF CDN Bypass Pattern**

The highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training. This solution combines the strongest insights from both candidate proposals, resolving contradictions in favor of correctness and concrete actionability.

**Implementation Plan:**

1. **Pre-list file paths**: Make a single API call to `list_repo_tree` for the dataset repository and save the list to a JSON file. This call should be made from the Mac (after the rate-limit window clears) to avoid blocking the training process.
2. **Embed file list in training script**: Modify the training script to read the pre-listed file paths from the JSON file and use them for CDN-only fetches.
3. **Update training script to use CDN**: Modify the training script to download files from the CDN using the pre-listed file paths, bypassing the HF API rate limit.

**Code Snippets:**

```bash
# Pre-list file paths and save to JSON file
curl -X GET \
  https://huggingface.co/api/repo/list_repo_tree \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"repo_id": "your_repo_id", "path": "your_path", "recursive": false}' > file_paths.json
```

```python
# Embed file list in training script and use CDN for downloads
import json
import requests

with open('file_paths.json') as f:
  file_paths = json.load(f)

for file_path in file_paths:
  file_url = f"https://huggingface.co/datasets/your_repo_id/resolve/main/{file_path['path']}"
  # Download file from CDN using file_url
  response = requests.get(file_url)
  with open(file_path['path'], 'wb') as f:
    f.write(response.content)
```

**Benefits:**

Implementing the HF CDN Bypass pattern will allow the training process to download dataset files directly from the CDN, avoiding rate-limit blocks and reducing the overall training time. This improvement can be shipped in <2h and will have a significant impact on the project's performance. Additionally, this fix will reduce the number of API calls made during data load, resulting in faster training times.

**Action Items:**

1. Pre-list file paths using the `list_repo_tree` API call and save the list to a JSON file.
2. Modify the training script to read the pre-listed file paths from the JSON file and use them for CDN-only fetches.
3. Update the training script to download files from the CDN using the pre-listed file paths, bypassing the HF API rate limit.

By following these steps, you can implement the HF CDN Bypass pattern and improve the performance of your training process.
