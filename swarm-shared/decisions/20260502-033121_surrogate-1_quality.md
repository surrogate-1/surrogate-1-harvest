# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass to download dataset files, which can help avoid API rate limits.
* The project does not have a mechanism to handle the HF API rate limit 429 error, which can cause the training pipeline to fail.
* The implementation does not ensure that the training script is executed with the proper Bash shebang and executable permissions.
* The project does not have a strategy to handle the Lightning H200 GPU instance, which is not available in the default cloud account.

### Proposed change
The proposed change is to implement the HF CDN bypass to download dataset files and handle the HF API rate limit 429 error. This change will be made in the `train.py` file, which is responsible for training the surrogate-1 model.

### Implementation
To implement the HF CDN bypass, we will use the `requests` library to download the dataset files from the HF CDN. We will also add a retry mechanism to handle the HF API rate limit 429 error.

```python
import requests
import time

def download_dataset_file(file_path):
    url = f"https://huggingface.co/datasets/{file_path}/resolve/main/{file_path}"
    response = requests.get(url)
    if response.status_code == 429:
        time.sleep(360)  # wait for 6 minutes before retrying
        return download_dataset_file(file_path)
    return response.content

def train_model():
    # download dataset files using HF CDN bypass
    dataset_files = ["file1.parquet", "file2.parquet"]
    for file in dataset_files:
        file_path = download_dataset_file(file)
        # process the file
        pass

    # train the model
    # ...
```

To ensure that the training script is executed with the proper Bash shebang and executable permissions, we will add the following lines to the `train.sh` file:
```bash
#!/usr/bin/env bash
chmod +x train.py
bash train.py
```

### Verification
To verify that the implementation works, we can run the `train.sh` file and check that the dataset files are downloaded successfully using the HF CDN bypass. We can also check that the training pipeline completes without any errors.

```bash
bash train.sh
```

We can also add some logging statements to the `train.py` file to verify that the HF CDN bypass is working correctly:
```python
import logging

logging.basicConfig(level=logging.INFO)

def download_dataset_file(file_path):
    # ...
    logging.info(f"Downloaded {file_path} successfully")
    # ...
```

By running the `train.sh` file and checking the logs, we can verify that the implementation is working correctly.
