# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass, which can download public dataset files without authorization headers and bypass API rate limits.
* The project does not have a mechanism to properly reuse existing Lightning Studios, which can save 80hr/mo quota when iterating training scripts.
* The implementation is prone to errors due to the lack of a proper retry mechanism for API calls, which can lead to training process failures.
* The project does not have a clear and efficient way to handle dataset mirroring, which can lead to mixed-schema files being written to the enriched directory.

### Proposed change
The proposed change is to implement the HF CDN bypass and ensure proper reuse of existing Lightning Studios. This will involve modifying the `train.py` script to use the HF CDN bypass for dataset downloads and adding a mechanism to reuse existing Lightning Studios.

### Implementation
To implement the HF CDN bypass, we will modify the `train.py` script to use the `hf_hub_download` function to download dataset files from the HF CDN. We will also add a mechanism to reuse existing Lightning Studios by listing the running studios and reusing them if available.

```python
import os
import json
from huggingface_hub import Repository

# Define the dataset repository and file path
repo_id = "dataset/repo"
file_path = "path/to/file"

# Define the Lightning Studio name
studio_name = "surrogate-1-studio"

# List the running Lightning Studios
studios = Teamspace.studios
for studio in studios:
    if studio.name == studio_name and studio.status == 'Running':
        # Reuse the existing studio
        studio_id = studio.id
        break
else:
    # Create a new studio
    studio_id = Teamspace.create_studio(studio_name)

# Download the dataset file from the HF CDN
repo = Repository(local_dir="/opt/axentx/surrogate-1", repo_id=repo_id)
file_path = repo.resolve_main_path(file_path)
with open(file_path, 'rb') as f:
    dataset_file = f.read()

# Train the model using the downloaded dataset file
# ...
```

To add a retry mechanism for API calls, we will use the `tenacity` library to retry failed API calls with a backoff strategy.

```python
import tenacity

@tenacity.retry(wait=tenacity.wait_exponential(multiplier=1, min=4, max=10))
def api_call_with_retry(api_func, *args, **kwargs):
    try:
        return api_func(*args, **kwargs)
    except Exception as e:
        # Log the error and retry
        print(f"Error: {e}")
        raise
```

### Verification
To verify that the changes work, we can run the `train.py` script and check that the dataset file is downloaded from the HF CDN and that the model is trained successfully. We can also check the Lightning Studio logs to ensure that the studio is reused correctly.

```bash
python train.py
```

We can also add tests to verify that the HF CDN bypass and studio reuse mechanisms work correctly.

```python
import unittest
from train import download_dataset_file, reuse_studio

class TestTrain(unittest.TestCase):
    def test_download_dataset_file(self):
        # Test that the dataset file is downloaded from the HF CDN
        file_path = download_dataset_file(repo_id, file_path)
        self.assertTrue(os.path.exists(file_path))

    def test_reuse_studio(self):
        # Test that the studio is reused correctly
        studio_id = reuse_studio(studio_name)
        self.assertIsNotNone(studio_id)

if __name__ == '__main__':
    unittest.main()
```
