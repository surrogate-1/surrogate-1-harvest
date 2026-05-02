# surrogate-1 / backend

### Comprehensive Solution

After synthesizing the best parts of multiple AI proposals, we have identified the key issues and proposed a comprehensive solution to address them. The main objectives of this solution are to:

1.  Implement a robust mechanism to handle Hugging Face API rate limits on the discovery side.
2.  Reuse existing Lightning Studio instances efficiently to avoid wasted resources.
3.  Handle mixed schema files in the dataset to prevent errors during training.
4.  Utilize the HF CDN bypass to download dataset files, reducing unnecessary API calls and potential rate limit issues.
5.  Implement a reliable mechanism to restart training processes if they are stopped due to Lightning idle timeouts.

### Implementation

To achieve these objectives, we will modify the `train.py` and `dataset_loader.py` files as follows:

#### Handling Hugging Face API Rate Limits

We will implement a robust mechanism to handle Hugging Face API rate limits by using the HF CDN bypass for public dataset files. This can be achieved by replacing the `list_repo_files` API call with a direct download from the HF CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL.

```python
import requests

def download_dataset_files(repo, path):
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"Failed to download dataset file: {url}")
```

#### Reusing Existing Lightning Studio Instances

We will implement a mechanism to reuse existing Lightning Studio instances by listing the existing studios using `Teamspace.studios` and reusing the running instances.

```python
import lightning

def get_studio_instance(studio_name):
    for s in lightning.Teamspace.studios:
        if s.name == studio_name and s.status == 'Running':
            return s
    return None

def train_model():
    studio_name = "my_studio"
    studio_instance = get_studio_instance(studio_name)
    if studio_instance is None:
        studio_instance = lightning.Studio.create(studio_name)
    # Start training
    studio_instance.start()
```

#### Handling Mixed Schema Files

We will handle mixed schema files in the dataset by projecting the files to `{prompt, response}` only at parse time using the `pyarrow` library.

```python
import pyarrow

def load_dataset(repo, path):
    files = download_dataset_files(repo, path)
    # Parse the files and project to {prompt, response}
    dataset = pyarrow.parquet.read_table(files)
    dataset = dataset.select(["prompt", "response"])
    return dataset
```

#### Restarting Training Processes

We will implement a reliable mechanism to restart training processes if they are stopped due to Lightning idle timeouts by checking the status of the Lightning Studio instance before each `.run()` call and restarting the instance if it is stopped.

```python
def train_model():
    # ...
    if studio_instance.status == "Stopped":
        # Restart the instance
        studio_instance.start(machine=lightning.Machine.L40S)
    # ...
```

### Verification

To verify that the proposed solution works, we will:

1.  Run the modified `train.py` script and check if the dataset is downloaded successfully from the HF CDN.
2.  Check if the existing Lightning Studio instances are reused efficiently by listing the studios using `Teamspace.studios` and verifying that the running instances are reused.
3.  Monitor the status of the Lightning Studio instance and verify that it is restarted if it is stopped.
4.  Check the training logs to ensure that the training process is not blocked by the Hugging Face API rate limits.

By implementing these changes, we can ensure that the project is robust, efficient, and reliable, and that the training process is not blocked by Hugging Face API rate limits or idle timeouts.
