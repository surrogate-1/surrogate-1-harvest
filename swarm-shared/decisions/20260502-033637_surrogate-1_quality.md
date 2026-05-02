# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass to download dataset files, which can help avoid rate limits.
* The project does not have a mechanism to handle the HF API rate limit 429 error, which can cause the training process to fail.
* The implementation does not ensure that the wrapper scripts have the proper Bash shebang, are executable, and are invoked via Bash, which can lead to script execution errors.
* The project does not have a robust way to handle the Lightning Studio idle timeout, which can kill the training process.

### Proposed change
The proposed change is to implement the HF CDN bypass to download dataset files and handle the HF API rate limit 429 error. This change will be made in the `train.py` file, which is responsible for training the surrogate-1 model.

### Implementation
To implement the HF CDN bypass, we will use the `requests` library to download the dataset files from the HF CDN. We will also add a mechanism to handle the HF API rate limit 429 error by waiting for 360 seconds before retrying the download.

```python
import requests
import time

def download_dataset_file(file_path):
    url = f"https://huggingface.co/datasets/{file_path}/resolve/main/{file_path}"
    headers = {"Authorization": "Bearer YOUR_HF_TOKEN"}
    response = requests.get(url, headers=headers)
    if response.status_code == 429:
        time.sleep(360)
        return download_dataset_file(file_path)
    return response.content

def train_model():
    # Download dataset files using HF CDN bypass
    dataset_files = ["file1.parquet", "file2.parquet"]
    for file in dataset_files:
        file_content = download_dataset_file(file)
        # Process the file content
        pass
    # Train the model
    pass
```

To handle the Lightning Studio idle timeout, we will add a mechanism to check the status of the studio before each `.run()` call and restart the studio if it is stopped.

```python
import lightning

def train_model():
    # Create a Lightning Studio
    studio = lightning.Studio()
    # Check the status of the studio before each .run() call
    if studio.status == "Stopped":
        studio.start(machine=lightning.Machine.L40S)
    # Train the model
    pass
```

### Verification
To verify that the changes work, we can run the `train.py` file and check that the dataset files are downloaded successfully using the HF CDN bypass. We can also check that the training process does not fail due to the HF API rate limit 429 error. Additionally, we can verify that the Lightning Studio idle timeout is handled correctly by checking that the studio is restarted if it is stopped.

```bash
python train.py
```

We can also add some logging statements to verify that the changes are working as expected.

```python
import logging

logging.basicConfig(level=logging.INFO)

def download_dataset_file(file_path):
    # ...
    logging.info(f"Downloaded {file_path} successfully")
    # ...

def train_model():
    # ...
    logging.info("Training model...")
    # ...
```
