# surrogate-1 / backend

### Diagnosis
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* The existing implementation may not be reusing existing Lightning Studio instances efficiently, leading to wasted resources.
* The project does not have a mechanism to bypass the Hugging Face API rate limit for dataset training, which can cause significant delays.
* The current implementation does not handle the Lightning H200 instance not being available in the default cloud account, which can lead to training delays.
* The project does not have a mechanism to spread writes across multiple sibling repositories to avoid the Hugging Face commit cap.

### Proposed change
The proposed change is to implement a mechanism to bypass the Hugging Face API rate limit for dataset training by using the Hugging Face CDN to download dataset files. This can be achieved by modifying the `train.py` script to download dataset files from the Hugging Face CDN instead of using the Hugging Face API.

### Implementation
To implement this change, we need to modify the `train.py` script to use the Hugging Face CDN to download dataset files. We can do this by adding the following code to the `train.py` script:
```python
import requests

# Define the Hugging Face CDN URL for the dataset
cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"

# Download the dataset file from the Hugging Face CDN
response = requests.get(cdn_url)
with open("dataset_file.parquet", "wb") as f:
    f.write(response.content)
```
We also need to modify the `list_repo_tree` function to use the Hugging Face CDN to download the list of dataset files. We can do this by adding the following code to the `list_repo_tree` function:
```python
import requests

# Define the Hugging Face CDN URL for the dataset
cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"

# Download the list of dataset files from the Hugging Face CDN
response = requests.get(cdn_url)
with open("file_list.json", "w") as f:
    f.write(response.text)
```
We can then use the `file_list.json` file to download the dataset files from the Hugging Face CDN.

### Verification
To verify that the change works, we can run the `train.py` script and check that the dataset files are being downloaded from the Hugging Face CDN instead of the Hugging Face API. We can also check the Hugging Face API logs to confirm that the API rate limit is not being exceeded. Additionally, we can verify that the training process is completing successfully and that the model is being trained correctly.
