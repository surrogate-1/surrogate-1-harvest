# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass to download dataset files, which can help avoid API rate limits.
* The project does not have a mechanism to handle Lightning Studio idle stop, which can kill the training process.
* The implementation does not reuse existing Lightning Studios, which can save 80hr/mo quota.
* The project does not have a robust error handling mechanism for script execution errors, such as the opus pr reviewer script exec error.

### Proposed change
The proposed change is to implement the HF CDN bypass to download dataset files and reuse existing Lightning Studios to save quota. This change will be made in the `train.py` file and the `lightning_studio.py` file.

### Implementation
To implement the HF CDN bypass, we can modify the `train.py` file to download dataset files from the HF CDN instead of using the Hugging Face API. We can use the `requests` library to download the files.
```python
import requests

# Download dataset files from HF CDN
def download_dataset_files(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    with open(path, 'wb') as f:
        f.write(response.content)

# Download dataset files
download_dataset_files("dataset_repo", "dataset_file.parquet")
```
To reuse existing Lightning Studios, we can modify the `lightning_studio.py` file to list existing studios and reuse the running ones.
```python
import lightning

# List existing studios and reuse the running ones
def reuse_studio(name):
    for s in lightning.Teamspace.studios:
        if s.name == name and s.status == 'Running':
            return s
    return None

# Reuse existing studio
studio = reuse_studio("studio_name")
if studio:
    # Use the reused studio
    studio.run()
else:
    # Create a new studio
    studio = lightning.Studio(create_ok=True)
    studio.run()
```
### Verification
To verify that the changes work, we can run the `train.py` file and check that the dataset files are downloaded from the HF CDN instead of using the Hugging Face API. We can also check that the existing Lightning Studios are reused and that the training process is not killed by the idle stop.
```bash
# Run the train.py file
python train.py

# Check that the dataset files are downloaded from the HF CDN
ls dataset_file.parquet

# Check that the existing Lightning Studios are reused
lightning studio list
```
We can also add some logging statements to the `train.py` file to verify that the changes work.
```python
import logging

# Add logging statements
logging.info("Downloading dataset files from HF CDN")
download_dataset_files("dataset_repo", "dataset_file.parquet")
logging.info("Reusing existing Lightning Studio")
studio = reuse_studio("studio_name")
if studio:
    logging.info("Using reused studio")
    studio.run()
else:
    logging.info("Creating a new studio")
    studio = lightning.Studio(create_ok=True)
    studio.run()
```
