# Costinel / frontend

**Highest-Value Incremental Improvement for Costinel Frontend**

**Task:** Implement HF CDN Bypass for dataset training

**Tags:** #huggingface #cdn #rate-limit-bypass #training

**Implementation Plan:**

1. **Update `train.py`**: Embed pre-listed file paths from a JSON file in the training script.
2. **Single API call**: Use `list_repo_tree(path, recursive=False)` on Mac (after rate-limit window clears) to list file paths for one date folder.
3. **Save list to JSON**: Store the file paths in a JSON file for future use.
4. **Lightning training**: Use CDN-only fetches with zero API calls during data load.

**Code Snippets:**

```python
# train.py
import json

# Load pre-listed file paths from JSON
with open('file_paths.json', 'r') as f:
    file_paths = json.load(f)

# Use CDN-only fetches with zero API calls during data load
dataset = Dataset.from_pandas(pd.DataFrame({'prompt': [], 'response': []}))
dataset = dataset.map(lambda example: example['prompt'], batched=True)
```

```bash
# Mac script to list file paths and save to JSON
#!/usr/bin/env bash

# Set API endpoint and credentials
API_ENDPOINT="https://huggingface.co/datasets/{repo}/resolve/main/{path}"
API_KEY="YOUR_API_KEY"

# List file paths for one date folder
file_paths=$(curl -s -X GET \
  "$API_ENDPOINT" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  | jq -r '.files[] | .path')

# Save file paths to JSON
echo "$file_paths" > file_paths.json
```

**Estimated Time:** <2h

**Notes:** This implementation bypasses the HF API rate limit by using the CDN to download dataset files. The pre-listed file paths are stored in a JSON file and embedded in the training script.
