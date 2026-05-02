# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* The existing implementation may not be reusing existing Lightning Studio instances efficiently, leading to wasted resources.
* The project does not have a mechanism to bypass the Hugging Face API rate limit for dataset training, which can cause significant delays.
* The current implementation of the training pipeline may not be optimized for performance, leading to slower training times.
* The project does not have a reliable way to handle Lightning Studio idle timeouts, which can kill training processes.

### Proposed change
The proposed change is to implement a robust mechanism to handle Hugging Face API rate limits and bypass them for dataset training. This can be achieved by using the Hugging Face CDN to download dataset files directly, without going through the API. Additionally, we will implement a mechanism to reuse existing Lightning Studio instances and handle idle timeouts.

The changes will be made in the following files:
* `train.py`
* `lightning_studio.py`
* `hugging_face_api.py`

### Implementation
To implement the proposed changes, we will follow these steps:

1. **Modify `train.py` to use Hugging Face CDN**:
```python
import requests

# Define the Hugging Face CDN URL
cdn_url = "https://huggingface.co/datasets/{repo}/resolve/main/{path}"

# Define the dataset repository and path
repo = "my-dataset"
path = "my-dataset-file.parquet"

# Download the dataset file from the Hugging Face CDN
response = requests.get(cdn_url.format(repo=repo, path=path))
with open("dataset.parquet", "wb") as f:
    f.write(response.content)
```

2. **Modify `lightning_studio.py` to reuse existing instances**:
```python
import lightning

# Define the Lightning Studio instance name
instance_name = "my-studio"

# Check if an instance with the same name already exists
for studio in lightning.Teamspace.studios:
    if studio.name == instance_name and studio.status == "Running":
        # Reuse the existing instance
        studio_instance = studio
        break
else:
    # Create a new instance
    studio_instance = lightning.Studio(create_ok=True)
```

3. **Modify `hugging_face_api.py` to handle rate limits**:
```python
import time

# Define the Hugging Face API rate limit
rate_limit = 1000

# Define the rate limit wait time
wait_time = 360

# Check if the rate limit has been exceeded
if response.status_code == 429:
    # Wait for the specified time before retrying
    time.sleep(wait_time)
    # Retry the request
    response = requests.get(api_url)
```

4. **Modify `train.py` to handle Lightning Studio idle timeouts**:
```python
import lightning

# Define the Lightning Studio instance name
instance_name = "my-studio"

# Check if the instance has timed out
if studio_instance.status == "Stopped":
    # Restart the instance
    studio_instance.start(machine=lightning.Machine.L40S)
```

### Verification
To verify that the changes work as expected, we can follow these steps:

1. **Test the Hugging Face CDN download**:
	* Run the `train.py` script and verify that the dataset file is downloaded correctly from the Hugging Face CDN.
	* Check the dataset file for any errors or corruption.
2. **Test the Lightning Studio instance reuse**:
	* Run the `lightning_studio.py` script and verify that an existing instance is reused correctly.
	* Check the instance status and verify that it is running as expected.
3. **Test the Hugging Face API rate limit handling**:
	* Run the `hugging_face_api.py` script and verify that the rate limit is handled correctly.
	* Check the API response and verify that it is not blocked by the rate limit.
4. **Test the Lightning Studio idle timeout handling**:
	* Run the `train.py` script and verify that the instance is restarted correctly after an idle timeout.
	* Check the instance status and verify that it is running as expected.
