# Costinel / backend

### Highest-Value Incremental Improvement
Based on the provided patterns and lessons learned, the highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit 429 error. This error occurs when the `list_repo_files` function is called recursively on large repositories, exceeding the 1000 requests per 5 minutes limit.

### Implementation Plan
To fix this issue, we will use the `list_repo_tree` function with `recursive=False` to fetch file paths for a specific date folder. We will then save the list of file paths to a JSON file and embed it in the training script.

#### Step 1: Update the `list_repo_files` function
We will replace the `list_repo_files` function with `list_repo_tree` and set `recursive=False` to avoid paginating 100 times.

```python
import json

def get_file_paths(repo_id, date_folder):
    file_paths = []
    for file in list_repo_tree(repo_id, path=date_folder, recursive=False):
        file_paths.append(file.path)
    return file_paths

# Example usage:
repo_id = "your-repo-id"
date_folder = "your-date-folder"
file_paths = get_file_paths(repo_id, date_folder)

# Save file paths to a JSON file
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)
```

#### Step 2: Embed the file paths in the training script
We will update the training script to read the file paths from the JSON file and use them to download the files from the HF CDN.

```python
import json

# Load file paths from JSON file
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

# Download files from HF CDN
for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{file_path}"
    # Download file using the file_url
    # ...
```

#### Step 3: Update the cron job to set SHELL=/bin/bash
We will update the cron job to set `SHELL=/bin/bash` to ensure that the script is executed with the correct shell.

```bash
# Update cron job
crontab -e
```

Add the following line to the cron job:
```bash
SHELL=/bin/bash
```

### Code Snippets
The code snippets above demonstrate the changes needed to fix the HF API rate limit 429 error. By using `list_repo_tree` with `recursive=False` and saving the file paths to a JSON file, we can avoid exceeding the API rate limit and ensure that our training script can download the necessary files from the HF CDN.

### Tags
#huggingface #api-rate-limit #fix #training-script #json #file-paths #cdn #download #cron-job #shell #bash
