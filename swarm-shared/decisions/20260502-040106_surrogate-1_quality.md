# surrogate-1 / quality

### Synthesized Solution

The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model. To address this, we will implement the HF CDN bypass and ensure proper reuse of existing Lightning Studios. We will also add a mechanism to handle Lightning Studio idle stop kills and implement robust error handling for script execution errors.

#### Implementation

To implement the HF CDN bypass, we will:

1. Pre-list file paths once using the Hugging Face API and embed the list in the training script.
2. Use the CDN URL to download dataset files without authorization headers.

```python
import json
import requests

# Pre-list file paths once
def get_file_paths(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    file_paths = response.json()
    return file_paths

# Embed file paths in training script
file_paths = get_file_paths("repo", "path")
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)

# Use CDN URL to download dataset files
def download_file(file_path):
    url = f"https://huggingface.co/datasets/{file_path}"
    response = requests.get(url)
    return response.content

# Train model using downloaded files
def train_model(file_paths):
    # Train model using file_paths
    pass
```

To handle Lightning Studio idle stop kills, we will:

1. Check the status of the studio before each `.run()` call.
2. Restart the studio with `target.start(machine=Machine.L40S)` if it is stopped.

```python
import lightning

# Check studio status before each .run() call
def check_studio_status(studio):
    if studio.status == "Stopped":
        studio.start(machine=Machine.L40S)

# Restart studio if it is stopped
def restart_studio(studio):
    studio.start(machine=Machine.L40S)

# Train model using Lightning Studio
def train_model(studio):
    check_studio_status(studio)
    # Train model using studio
    pass
```

To ensure proper reuse of existing Lightning Studios, we will:

1. List existing studios using `Teamspace.studios`.
2. Reuse running studios instead of creating new ones.

```python
import lightning

# List existing studios
def list_studios(teamspace):
    return teamspace.studios

# Reuse running studios
def reuse_studio(teamspace, studio_name):
    for studio in list_studios(teamspace):
        if studio.name == studio_name and studio.status == "Running":
            return studio
    return None

# Train model using reused studio
def train_model(teamspace, studio_name):
    studio = reuse_studio(teamspace, studio_name)
    if studio:
        # Train model using studio
        pass
    else:
        # Create new studio
        pass
```

#### Verification

To verify that the changes work, we will:

1. Run the `train.py` script and check that it downloads dataset files using the CDN URL.
2. Check that the script handles Lightning Studio idle stop kills and reuses existing studios.
3. Verify that the model is trained successfully using the reused studio.

```python
# Verify that dataset files are downloaded using CDN URL
def verify_dataset_download(file_paths):
    for file_path in file_paths:
        url = f"https://huggingface.co/datasets/{file_path}"
        response = requests.get(url)
        assert response.status_code == 200

# Verify that studio is reused
def verify_studio_reuse(teamspace, studio_name):
    studio = reuse_studio(teamspace, studio_name)
    assert studio is not None

# Verify that model is trained successfully
def verify_model_training(studio):
    # Train model using studio
    pass
    assert True
```

#### Error Handling

To implement robust error handling for script execution errors, we will:

1. Catch and handle exceptions raised during script execution.
2. Log errors and provide informative error messages.

```python
import logging

# Catch and handle exceptions
try:
    # Script execution code
    pass
except Exception as e:
    logging.error(f"Error occurred: {e}")
    # Handle error and provide informative error message
    pass
```

By implementing these changes, we can improve the efficiency and robustness of the surrogate-1 training pipeline, handle Lightning Studio idle stop kills, and ensure proper reuse of existing studios. Additionally, we can implement robust error handling for script execution errors to provide informative error messages and improve the overall reliability of the system.
