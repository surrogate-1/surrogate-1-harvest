# surrogate-1 / discovery

### Diagnosis
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* The existing implementation may not be reusing existing Lightning Studio instances efficiently, leading to wasted resources.
* The project does not have a mechanism to bypass the Hugging Face API rate limit for dataset training, which can cause significant delays.
* The current implementation does not pre-list file paths once and embed them in the training script, leading to repeated API calls and potential rate limit issues.
* The project does not have a reliable way to check the status of Lightning Studio instances before running training scripts, which can cause training processes to die unexpectedly.

### Proposed change
The proposed change is to implement a mechanism to bypass the Hugging Face API rate limit for dataset training by pre-listing file paths once and embedding them in the training script. This change will be made in the `train.py` file, which is responsible for training the model.

### Implementation
To implement this change, we will:
1. Create a new script `get_file_paths.py` that will pre-list the file paths for the dataset using the Hugging Face API.
2. Modify the `train.py` script to read the file paths from a JSON file instead of making API calls to get the file paths.
3. Use the `hf_hub_download` function to download the dataset files from the Hugging Face CDN, which has a separate rate limit.

Here is an example of the code changes:
```python
# get_file_paths.py
import json
import requests

def get_file_paths(repo, path):
    response = requests.get(f"https://huggingface.co/{repo}/resolve/main/{path}")
    file_paths = response.json()
    with open("file_paths.json", "w") as f:
        json.dump(file_paths, f)

# train.py
import json
import os

def train_model():
    with open("file_paths.json", "r") as f:
        file_paths = json.load(f)
    for file_path in file_paths:
        # download file from Hugging Face CDN
        file_name = os.path.basename(file_path)
        response = requests.get(f"https://huggingface.co/{repo}/resolve/main/{file_path}")
        with open(file_name, "wb") as f:
            f.write(response.content)
        # train model using downloaded file
```
### Verification
To verify that this change works, we can:
1. Run the `get_file_paths.py` script to pre-list the file paths and save them to a JSON file.
2. Run the `train.py` script to train the model using the pre-listed file paths.
3. Monitor the API calls and rate limit usage to ensure that the change has reduced the number of API calls and avoided rate limit issues.
4. Verify that the model is trained successfully and that the training process does not die unexpectedly due to rate limit issues.
