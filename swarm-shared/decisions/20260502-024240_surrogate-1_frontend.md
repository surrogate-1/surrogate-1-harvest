# surrogate-1 / frontend

### Diagnosis
* The project lacks a robust frontend implementation to handle data ingestion and training for the surrogate-1 model.
* The current implementation relies heavily on the Hugging Face API, which has rate limits that can block dataset training.
* The project does not utilize the HF CDN bypass strategy to download dataset files, resulting in unnecessary API calls and potential rate limit issues.
* The frontend does not implement a mechanism to reuse existing Lightning Studio instances, leading to wasted quota and potential idle timeout issues.
* The project does not handle errors and exceptions properly, which can cause training processes to fail or terminate unexpectedly.

### Proposed change
The proposed change is to implement the HF CDN bypass strategy and reuse existing Lightning Studio instances in the frontend. This will involve modifying the `train.py` script to download dataset files from the HF CDN and reuse existing studio instances.

### Implementation
To implement the proposed change, follow these steps:

1. Modify the `train.py` script to download dataset files from the HF CDN:
```python
import requests

# Define the dataset repository and file path
repo_id = "dataset/repo"
file_path = "path/to/file"

# Download the file from the HF CDN
url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{file_path}"
response = requests.get(url)

# Save the file to a local directory
with open(f"{file_path}.parquet", "wb") as f:
    f.write(response.content)
```
2. Modify the `train.py` script to reuse existing Lightning Studio instances:
```python
import lightning

# Define the studio name and teamspace
studio_name = "surrogate-1-studio"
teamspace = "axentx"

# List existing studio instances
studios = lightning.Teamspace(teamspace).studios

# Reuse an existing studio instance if available
for studio in studios:
    if studio.name == studio_name and studio.status == "Running":
        studio_instance = studio
        break
else:
    # Create a new studio instance if none exist
    studio_instance = lightning.Studio.create(
        name=studio_name, teamspace=teamspace, create_ok=True
    )

# Use the studio instance to run the training process
studio_instance.run(
    # Define the training process here
)
```
3. Handle errors and exceptions properly by adding try-except blocks to the code:
```python
try:
    # Download dataset files from the HF CDN
    # ...
except requests.exceptions.RequestException as e:
    print(f"Error downloading dataset files: {e}")

try:
    # Reuse existing Lightning Studio instances
    # ...
except lightning.exceptions.StudioException as e:
    print(f"Error reusing studio instance: {e}")
```
### Verification
To verify that the proposed change works, follow these steps:

1. Run the modified `train.py` script and verify that it downloads dataset files from the HF CDN successfully.
2. Verify that the script reuses an existing Lightning Studio instance if available.
3. Verify that the script handles errors and exceptions properly by simulating errors and exceptions during the training process.
4. Monitor the training process and verify that it completes successfully without any issues related to rate limits or idle timeouts.
