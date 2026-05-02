# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass to download dataset files, which can help avoid rate limits.
* The project does not have a mechanism to handle the HF API rate limit of 1000 requests per 5 minutes, which can cause the training pipeline to fail.
* The implementation does not ensure that the training script is executed in a Lightning Studio with a suitable machine type (e.g., H200) to avoid idle timeouts.
* The project does not have a robust way to handle errors and exceptions that may occur during data ingestion and training.

### Proposed change
The proposed change is to implement the HF CDN bypass to download dataset files and avoid rate limits. This can be achieved by modifying the `train.py` script to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.

### Implementation
To implement the HF CDN bypass, the following steps can be taken:
1. Modify the `train.py` script to download dataset files from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
2. Use the `requests` library to download the dataset files from the HF CDN.
3. Save the downloaded dataset files to a local directory.
4. Modify the `train.py` script to use the local dataset files instead of downloading them from the Hugging Face API.

Example code snippet:
```python
import requests

# Define the dataset repository and file path
repo = "dataset/repo"
file_path = "path/to/file.csv"

# Download the dataset file from the HF CDN
url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
response = requests.get(url)

# Save the downloaded dataset file to a local directory
with open(f"local/{file_path}", "wb") as f:
    f.write(response.content)
```
### Verification
To verify that the HF CDN bypass is working correctly, the following steps can be taken:
1. Run the modified `train.py` script and check that the dataset files are being downloaded from the HF CDN.
2. Check that the training pipeline is completing successfully without encountering rate limits.
3. Verify that the downloaded dataset files are being used correctly by the training script.
4. Monitor the training pipeline for any errors or exceptions that may occur during data ingestion and training.
