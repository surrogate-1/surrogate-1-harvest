# surrogate-1 / backend

### Diagnosis
* The project lacks a robust data ingestion pipeline, which is crucial for training and updating the surrogate-1 model.
* The current implementation uses the Hugging Face API, which has rate limits that can block dataset training.
* The project does not have a README file, which makes it difficult for new contributors to understand the project's purpose and usage.
* The HF API rate limit can be bypassed by using the CDN tier, but this requires pre-listing file paths and embedding them in the training script.
* The Lightning Studio reuse pattern can save 80hr/mo quota, but it requires checking the status of the studio before each run and restarting it if necessary.

### Proposed change
The proposed change is to implement a robust data ingestion pipeline using the HF CDN bypass pattern. This involves pre-listing file paths, embedding them in the training script, and using the CDN tier to download dataset files. Additionally, the Lightning Studio reuse pattern will be implemented to save 80hr/mo quota.

### Implementation
To implement the proposed change, the following steps will be taken:
1. Create a new script `ingest_data.py` in the `/opt/axentx/surrogate-1` directory with the following code:
```python
import json
import requests

# Pre-list file paths
def pre_list_file_paths(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    file_paths = []
    for file in response.json():
        file_paths.append(file["path"])
    return file_paths

# Embed file paths in training script
def embed_file_paths(file_paths):
    with open("train.py", "r") as f:
        train_script = f.read()
    train_script = train_script.replace("FILE_PATHS = []", f"FILE_PATHS = {json.dumps(file_paths)}")
    with open("train.py", "w") as f:
        f.write(train_script)

# Download dataset files using CDN tier
def download_dataset_files(file_paths):
    for file_path in file_paths:
        url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
        response = requests.get(url)
        with open(file_path, "wb") as f:
            f.write(response.content)

# Main function
def main():
    repo = "your-repo-name"
    path = "your-path"
    file_paths = pre_list_file_paths(repo, path)
    embed_file_paths(file_paths)
    download_dataset_files(file_paths)

if __name__ == "__main__":
    main()
```
2. Modify the `train.py` script to use the embedded file paths:
```python
import json

# Load file paths
with open("train.py", "r") as f:
    train_script = f.read()
file_paths = json.loads(train_script.split("FILE_PATHS = ")[1].split("[")[0])

# Train model using file paths
for file_path in file_paths:
    # Train model using file_path
    pass
```
3. Implement the Lightning Studio reuse pattern by modifying the `train.py` script to check the status of the studio before each run and restart it if necessary:
```python
import lightning

# Check studio status
def check_studio_status():
    studio = lightning.Studio()
    if studio.status == "Stopped":
        studio.start()

# Main function
def main():
    check_studio_status()
    # Train model
    pass

if __name__ == "__main__":
    main()
```
### Verification
To verify that the proposed change works, the following steps can be taken:
1. Run the `ingest_data.py` script to pre-list file paths and embed them in the training script.
2. Run the `train.py` script to train the model using the embedded file paths.
3. Check the Lightning Studio status before each run and restart it if necessary.
4. Verify that the model is trained successfully and that the Lightning Studio quota is saved.
