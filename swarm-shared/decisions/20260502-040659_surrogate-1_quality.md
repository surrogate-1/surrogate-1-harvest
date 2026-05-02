# surrogate-1 / quality

### Synthesized Solution

The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model. To address this, we will implement the Hugging Face (HF) CDN bypass and ensure proper reuse of existing Lightning Studios.

#### Diagnosis

* The current implementation relies heavily on the Hugging Face API with rate limits that can block dataset training.
* The project does not utilize the HF CDN bypass, which can download public dataset files without authorization headers and bypass rate limits.
* The implementation does not properly reuse existing Lightning Studios, which can save 80hr/mo quota when iterating training scripts.
* The project does not handle the Lightning idle stop, which can kill the training process.
* The implementation lacks a robust error handling mechanism for the HF API rate limit and commit cap.

#### Proposed Change

The proposed change will focus on implementing the HF CDN bypass and reusing existing Lightning Studios. This will involve modifying the `train.py` script to download dataset files using the HF CDN bypass and adding a mechanism to reuse existing Lightning Studios.

#### Implementation

To implement the HF CDN bypass, we will:

1. Pre-list the file paths using the `list_repo_tree` API call and save the list to a JSON file.
2. Modify the `train.py` script to read the file paths from the JSON file and download the files using the HF CDN bypass.
3. Use the `hf_hub_download` function to download each file individually and project to `{prompt, response}` only at parse time.

To reuse existing Lightning Studios, we will:

1. List the existing studios using the `Teamspace.studios` API call.
2. Check if a studio with the same name and status 'Running' exists, and reuse it if found.
3. Modify the `train.py` script to use the reused studio instead of creating a new one.

Example code snippet:
```python
import json
import os
import requests
import lightning

# Pre-list file paths and save to JSON file
file_paths = []
for file in list_repo_tree(path, recursive=False):
    file_paths.append(file)
with open('file_paths.json', 'w') as f:
    json.dump(file_paths, f)

# Modify train.py to read file paths from JSON file and download using HF CDN bypass
with open('file_paths.json', 'r') as f:
    file_paths = json.load(f)
for file_path in file_paths:
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
    response = requests.get(url)
    if response.status_code == 200:
        with open(f"{file_path}.parquet", "wb") as f:
            f.write(response.content)
    else:
        print(f"Failed to download {url}")

# Reuse existing Lightning Studios
teamspace = lightning.Teamspace("teamspace-name")
studio_name = "studio-name"
for s in teamspace.studios:
    if s.name == studio_name and s.status == "Running":
        studio = s
        break
else:
    studio = teamspace.create_studio(studio_name)

# Use reused studio in train.py
studio.run()

# Handle Lightning idle stop
if studio.status == "Stopped":
    studio.start(machine=lightning.Machine.L40S)
```

#### Verification

To verify that the implementation works, we can:

1. Check the API call logs to ensure that the HF CDN bypass is being used.
2. Verify that the file paths are being read correctly from the JSON file.
3. Check the Lightning Studio logs to ensure that the reused studio is being used.
4. Monitor the training process to ensure that it is not being killed by the Lightning idle stop.
5. Test the error handling mechanism to ensure that it is handling the HF API rate limit and commit cap correctly.

By implementing the HF CDN bypass and reusing existing Lightning Studios, we can improve the robustness of the project's data ingestion and training process, reduce the risk of rate limits blocking dataset training, and save quota by reusing existing studios.
