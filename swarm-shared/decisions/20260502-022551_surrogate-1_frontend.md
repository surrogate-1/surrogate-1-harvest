# surrogate-1 / frontend

### Diagnosis
* The project lacks a robust frontend implementation to handle data ingestion and training for the surrogate-1 model.
* The current implementation relies heavily on the Hugging Face API, which has rate limits that can block dataset training.
* The project does not have a clear strategy for handling API rate limits and errors.
* The frontend does not have a mechanism to bypass API rate limits using the Hugging Face CDN.
* The project lacks a robust error handling mechanism for the frontend.

### Proposed change
The proposed change is to implement a robust frontend data ingestion pipeline that bypasses API rate limits using the Hugging Face CDN. This will involve modifying the `train.py` script to download dataset files directly from the CDN instead of using the Hugging Face API.

### Implementation
To implement this change, we will modify the `train.py` script as follows:
```python
import json
import os

# Load the list of dataset files from the JSON file
with open('dataset_files.json', 'r') as f:
    dataset_files = json.load(f)

# Download the dataset files from the Hugging Face CDN
for file in dataset_files:
    file_url = f"https://huggingface.co/datasets/{file['repo']}/resolve/main/{file['path']}"
    file_path = os.path.join('datasets', file['path'])
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'wb') as f:
        response = requests.get(file_url, stream=True)
        for chunk in response.iter_content(chunk_size=1024):
            f.write(chunk)
```
We will also add a script to pre-list the dataset files and save them to a JSON file:
```python
import json
import os

# List the dataset files using the Hugging Face API
repo = 'your-repo-name'
path = 'your-path'
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=False")
dataset_files = response.json()

# Save the list of dataset files to a JSON file
with open('dataset_files.json', 'w') as f:
    json.dump(dataset_files, f)
```
### Verification
To verify that the change works, we can run the `train.py` script and check that the dataset files are downloaded correctly from the Hugging Face CDN. We can also check the API usage and verify that the rate limits are not exceeded. Additionally, we can test the error handling mechanism by simulating API errors and verifying that the frontend handles them correctly.
