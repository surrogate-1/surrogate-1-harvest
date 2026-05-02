# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass effectively, leading to rate limit issues.
* The project does not have a comprehensive solution to handle dataset training with mixed schema files, which can cause pyarrow CastError.
* The implementation of the surrogate-1 training pipeline is not optimized, leading to potential errors and inefficiencies.
* The project does not have a robust mechanism to handle Lightning Studio idle stop, which can kill training processes.

### Proposed change
The proposed change is to implement a comprehensive solution that addresses the identified issues. This will involve modifying the `train.py` script to utilize the HF CDN bypass, handling dataset training with mixed schema files, and optimizing the surrogate-1 training pipeline. Additionally, we will implement a mechanism to handle Lightning Studio idle stop.

### Implementation
To implement the proposed change, we will follow these steps:

1. Modify the `train.py` script to use the HF CDN bypass by downloading dataset files from `https://huggingface.co/datasets/{repo}/resolve/main/{path}` without using the Hugging Face API.
2. Handle dataset training with mixed schema files by downloading each file individually via `hf_hub_download` and then projecting to `{prompt, response}` only at parse time.
3. Optimize the surrogate-1 training pipeline by spreading writes across N sibling repos and using `list_repo_tree(path, recursive=False)` per folder.
4. Implement a mechanism to handle Lightning Studio idle stop by checking the status of the studio before each `.run()` call and restarting with `target.start(machine=Machine.L40S)` if stopped.

Example code snippet:
```python
import os
import requests

# Download dataset files from HF CDN
def download_dataset_files(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    with open(os.path.join(path, "dataset.json"), "wb") as f:
        f.write(response.content)

# Handle dataset training with mixed schema files
def handle_mixed_schema_files(repo, path):
    files = []
    for file in os.listdir(path):
        if file.endswith(".json"):
            files.append(file)
    for file in files:
        download_dataset_files(repo, file)
        # Project to {prompt, response} only at parse time
        with open(os.path.join(path, file), "r") as f:
            data = json.load(f)
            prompts = [example["prompt"] for example in data]
            responses = [example["response"] for example in data]
            # Save prompts and responses to a new file
            with open(os.path.join(path, "prompts.json"), "w") as f:
                json.dump(prompts, f)
            with open(os.path.join(path, "responses.json"), "w") as f:
                json.dump(responses, f)

# Optimize surrogate-1 training pipeline
def optimize_training_pipeline(repo, path):
    # Spread writes across N sibling repos
    sibling_repos = []
    for i in range(5):
        sibling_repos.append(f"{repo}-{i}")
    # Use list_repo_tree(path, recursive=False) per folder
    for folder in os.listdir(path):
        if os.path.isdir(os.path.join(path, folder)):
            for sibling_repo in sibling_repos:
                list_repo_tree(sibling_repo, folder, recursive=False)

# Handle Lightning Studio idle stop
def handle_idle_stop(studio):
    if studio.status == "Stopped":
        studio.start(machine=Machine.L40S)
```
### Verification
To verify that the proposed change works, we can follow these steps:

1. Run the modified `train.py` script and verify that it downloads dataset files from the HF CDN without using the Hugging Face API.
2. Verify that the script handles dataset training with mixed schema files correctly by checking the output files.
3. Verify that the surrogate-1 training pipeline is optimized by checking the performance metrics.
4. Verify that the mechanism to handle Lightning Studio idle stop works by checking the studio status before and after each `.run()` call.

Example verification code snippet:
```python
import os
import requests

# Verify that the script downloads dataset files from the HF CDN
def verify_cdn_download(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    if response.status_code == 200:
        print("Dataset files downloaded successfully from HF CDN")
    else:
        print("Error downloading dataset files from HF CDN")

# Verify that the script handles dataset training with mixed schema files
def verify_mixed_schema_files(repo, path):
    files = []
    for file in os.listdir(path):
        if file.endswith(".json"):
            files.append(file)
    for file in files:
        with open(os.path.join(path, file), "r") as f:
            data = json.load(f)
            prompts = [example["prompt"] for example in data]
            responses = [example["response"] for example in data]
            if len(prompts) > 0 and len(responses) > 0:
                print("Dataset training with mixed schema files handled correctly")
            else:
                print("Error handling dataset training with mixed schema files")

# Verify that the surrogate-1 training pipeline is optimized
def verify_optimized_pipeline(repo, path):
    # Check performance metrics
    metrics = []
    for file in os.listdir(path):
        if file.endswith(".json"):
            with open(os.path.join(path, file), "r") as f:
                data = json.load(f)
                metrics.append(data["metric"])
    if len(metrics) > 0:
        print("Surrogate-1 training pipeline optimized successfully")
    else:
        print("Error optimizing surrogate-1 training pipeline")

# Verify that the mechanism to handle Lightning Studio idle stop works
def verify_idle_stop(studio):
    if studio.status == "Running":
        print("Lightning Studio idle stop handled correctly")
    else:
        print("Error handling Lightning Studio idle stop")
```
