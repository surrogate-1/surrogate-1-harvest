# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Update training script**: Modify the training script to download dataset files from the HF CDN instead of using the HF API.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to get the list of file paths for the dataset.
3. **Embed file list in training script**: Save the list of file paths to a JSON file and embed it in the training script.
4. **Use CDN-only fetches**: Update the training script to download dataset files from the CDN using the embedded file list.

### Code Snippets
```bash
# Pre-list file paths
hf_api_call=$(curl -X GET \
  https://huggingface.co/datasets/{repo}/tree/main \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json')

# Save file list to JSON
echo "$hf_api_call" > file_list.json

# Embed file list in training script
import json

with open('file_list.json') as f:
  file_list = json.load(f)

# Use CDN-only fetches
for file in file_list:
  file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
  # Download file from CDN
  curl -X GET $file_url -o $file
```
### Benefits
This improvement will allow the training script to bypass the HF API rate limit, reducing the likelihood of rate-limit blocks and improving overall training efficiency.
