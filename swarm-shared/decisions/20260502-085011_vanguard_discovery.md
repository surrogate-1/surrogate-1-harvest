# vanguard / discovery

### 1. **Diagnosis**
* The Vanguard project lacks a comprehensive solution to handle HF API rate limits, which can block dataset training and hinder the project's progress.
* The current implementation does not utilize the HF CDN bypass strategy, which can download public dataset files without hitting the API rate limit.
* The project's training pipeline is not optimized for performance, leading to potential bottlenecks and inefficiencies.
* The lack of a README file and incomplete documentation makes it difficult for new contributors to understand the project's architecture and goals.
* The project's recent commits suggest a focus on ops and quality cycles, but the discovery focus is lacking, indicating a need for improved exploration and research.

### 2. **Proposed change**
The proposed change is to implement the HF CDN bypass strategy in the training pipeline to download public dataset files without hitting the API rate limit. This change will be made in the `train.py` file, which is responsible for loading and processing the dataset.

### 3. **Implementation**
To implement the HF CDN bypass strategy, we will:
1. Pre-list the file paths for the dataset using a single API call to `list_repo_tree(path, recursive=False)`.
2. Save the list of file paths to a JSON file.
3. Modify the `train.py` file to embed the JSON file and use the CDN URLs to download the dataset files.
4. Update the `train.py` file to use the `requests` library to download the dataset files from the CDN URLs.

Example code snippet:
```python
import json
import requests

# Load the list of file paths from the JSON file
with open('file_paths.json') as f:
    file_paths = json.load(f)

# Download the dataset files from the CDN URLs
for file_path in file_paths:
    url = f'https://huggingface.co/datasets/{file_path}/resolve/main/{file_path}'
    response = requests.get(url)
    with open(f'{file_path}.parquet', 'wb') as f:
        f.write(response.content)
```
### 4. **Verification**
To verify that the HF CDN bypass strategy is working correctly, we can:
1. Monitor the API rate limit usage and verify that it is not being exceeded.
2. Check the dataset files are being downloaded correctly from the CDN URLs.
3. Verify that the training pipeline is completing successfully without hitting the API rate limit.
4. Measure the performance improvement of the training pipeline with the HF CDN bypass strategy implemented.
