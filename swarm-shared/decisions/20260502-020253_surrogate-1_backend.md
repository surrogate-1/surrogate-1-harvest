# surrogate-1 / backend

### Synthesized Solution

The project lacks a robust data ingestion pipeline, which is crucial for training and updating the surrogate-1 model. The current implementation uses the Hugging Face API, which has rate limits that can block dataset training. To address this issue, we propose implementing a robust data ingestion pipeline using the Hugging Face CDN bypass technique to avoid rate limits.

#### Proposed Change

The proposed change is to modify the `train.py` script to download dataset files directly from the CDN instead of using the Hugging Face API. This can be achieved by using the `hf_hub_download` function to download dataset files directly from the CDN.

#### Implementation

To implement this change, we will:

1. Modify the `train.py` script to use the `hf_hub_download` function to download dataset files directly from the CDN.
2. Update the `train.py` script to use the `list_repo_tree` function to get the list of files in the dataset repository, and then use this list to download the files directly from the CDN.
3. Add error handling to the `train.py` script to handle cases where the CDN download fails.

Example code snippet:
```python
import os
import json
from huggingface_hub import Repository

# Get the list of files in the dataset repository
repo = Repository(local_dir="/opt/axentx/surrogate-1", repo_type="dataset")
file_list = repo.list_repo_tree(path="path/to/dataset", recursive=False)

# Download the files directly from the CDN
for file in file_list:
    file_path = f"https://huggingface.co/datasets/{repo.repo_id}/resolve/main/{file}"
    os.system(f"wget {file_path} -O {file}")

# Update the train.py script to use the downloaded files for training
train_data = []
for file in file_list:
    with open(file, "r") as f:
        train_data.extend(json.load(f))

# Train the model using the downloaded data
model = ...
model.train(train_data)
```

#### Verification

To verify that the change works, we can:

1. Run the modified `train.py` script and check that the dataset files are downloaded correctly from the CDN.
2. Check the Hugging Face API logs to ensure that the rate limits are not being exceeded.
3. Monitor the performance of the surrogate-1 model training pipeline to ensure that it is running efficiently and without bottlenecks.
4. Check the project's logs to ensure that there are no errors or issues related to the data ingestion pipeline.

#### Additional Recommendations

* Create a README file to provide documentation for new contributors and explain the project's purpose and setup.
* Optimize the surrogate-1 model training pipeline for performance to avoid potential bottlenecks and inefficiencies.
* Follow the Mac=CLI rule to ensure that heavy compute tasks are run on remote servers instead of the Mac.

By implementing these changes, we can improve the robustness and efficiency of the data ingestion pipeline, avoid rate limit issues, and optimize the performance of the surrogate-1 model training pipeline.
