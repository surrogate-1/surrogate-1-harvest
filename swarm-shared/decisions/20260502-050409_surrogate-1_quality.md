# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation for data ingestion and training, relying heavily on the Hugging Face API with rate limits.
* There is inadequate reuse of existing Lightning Studio instances, leading to wasted quota and potential training interruptions.
* The project does not utilize the HF CDN bypass to download dataset files, resulting in rate limit blocks during training.
* The training pipeline does not handle pyarrow CastError on HF datasets with mixed schema files.
* The project does not implement active-learning wrapper execution with proper Bash shebang and executable permissions.

### Proposed change
To address the most critical issues, we will focus on implementing the HF CDN bypass and reusing existing Lightning Studio instances. The changes will be made in the `train.py` file and the `lightning_studio_launcher.py` script.

### Implementation
1. **HF CDN Bypass**:
   * Modify the `train.py` file to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
   * Pre-list file paths once and embed them in the training script using a single API call to `list_repo_tree(path, recursive=False)`.

```python
import json
import requests

# Pre-list file paths and save to JSON
repo = "your-repo"
path = "your-path"
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=false")
file_paths = response.json()["files"]
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)

# Load file paths from JSON and download files from HF CDN
with open("file_paths.json", "r") as f:
    file_paths = json.load(f)

for file_path in file_paths:
    file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    response = requests.get(file_url)
    with open(file_path, "wb") as f:
        f.write(response.content)
```

2. **Reuse Existing Lightning Studio Instances**:
   * Modify the `lightning_studio_launcher.py` script to list existing studios and reuse running ones.
   * Use the `Teamspace.studios` API to list existing studios and filter by name and status.

```python
import lightning

# List existing studios and reuse running ones
teamspace = lightning.Teamspace()
studios = teamspace.studios
for studio in studios:
    if studio.name == "your-studio-name" and studio.status == "Running":
        # Reuse the existing studio
        studio_id = studio.id
        break
else:
    # Create a new studio
    studio_id = teamspace.create_studio("your-studio-name")
```

### Verification
To confirm that the changes work, you can:
1. Verify that the dataset files are downloaded from the HF CDN by checking the file paths and contents.
2. Check the Lightning Studio instances and verify that existing running studios are reused.
3. Monitor the training pipeline and verify that it completes successfully without rate limit blocks or training interruptions.
4. Test the active-learning wrapper execution and verify that it runs with proper Bash shebang and executable permissions.
