# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass effectively, leading to rate limit issues.
* The project does not have a comprehensive solution to handle studio reuse and idle stop kills training in Lightning AI.

### Proposed change
To address the identified issues, we will implement a comprehensive solution that utilizes the HF CDN bypass and handles studio reuse and idle stop kills training in Lightning AI. The proposed change will be implemented in the `train.py` file, which is responsible for training the surrogate-1 model.

### Implementation
The implementation will involve the following steps:
1. Modify the `train.py` file to use the HF CDN bypass to download dataset files, bypassing the rate limit.
2. Implement studio reuse by checking if a studio with the same name and status 'Running' already exists, and reuse it if possible.
3. Handle idle stop kills training by checking the status of the studio before each `.run()` call and restarting the training process if the studio is stopped.

```python
import json
import os
import requests
from lightning import Lightning

# Load the list of file paths from the JSON file
with open('file_paths.json', 'r') as f:
    file_paths = json.load(f)

# Define the HF CDN URL
cdn_url = 'https://huggingface.co/datasets/{repo}/resolve/main/{path}'

# Download the dataset files using the HF CDN bypass
for file_path in file_paths:
    repo, path = file_path.split('/')
    url = cdn_url.format(repo=repo, path=path)
    response = requests.get(url)
    with open(os.path.join('data', path), 'wb') as f:
        f.write(response.content)

# Initialize the Lightning AI client
lightning = Lightning()

# Define the studio name and machine type
studio_name = 'surrogate-1-studio'
machine_type = 'L40S'

# Check if a studio with the same name and status 'Running' already exists
for studio in lightning.teamspace.studios:
    if studio.name == studio_name and studio.status == 'Running':
        # Reuse the existing studio
        studio_to_use = studio
        break
else:
    # Create a new studio
    studio_to_use = lightning.teamspace.create_studio(studio_name, machine_type)

# Train the model
while True:
    # Check the status of the studio before each .run() call
    if studio_to_use.status != 'Running':
        # Restart the training process if the studio is stopped
        studio_to_use.start(machine=machine_type)
    # Run the training process
    studio_to_use.run()
```

### Verification
To verify that the proposed change works, we can check the following:
* The dataset files are downloaded successfully using the HF CDN bypass.
* The studio reuse mechanism works correctly, and the existing studio is reused if possible.
* The training process is restarted correctly if the studio is stopped due to idle timeout.
We can verify these by checking the logs and the output of the training process. Additionally, we can monitor the studio status and the training process to ensure that they are working as expected.
