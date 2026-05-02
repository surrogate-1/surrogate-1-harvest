# surrogate-1 / backend

### Diagnosis
* The project lacks a robust data ingestion pipeline, which is crucial for training and updating the surrogate-1 model.
* The current implementation uses the Hugging Face API, which has rate limits that can block dataset training.
* The project does not have a mechanism to bypass the Hugging Face API rate limits, leading to potential training delays.
* The data ingestion pipeline is not optimized for performance, leading to inefficient data processing.
* The project relies on the Hugging Face API for dataset downloads, which can be rate-limited and may not be the most efficient approach.

### Proposed change
The proposed change is to implement a CDN bypass for dataset downloads using the Hugging Face CDN, which has separate and higher rate limits. This will involve modifying the data ingestion pipeline to use the CDN for dataset downloads instead of the Hugging Face API.

### Implementation
To implement the CDN bypass, we will modify the `data_ingestion.py` script to use the Hugging Face CDN for dataset downloads. We will use the `hf_hub_download` function to download datasets from the CDN, which will bypass the Hugging Face API rate limits.

```python
import os
import json
from huggingface_hub import hf_hub_download

# Define the dataset repository and filename
repo_id = "dataset/repo"
filename = "dataset.json"

# Download the dataset from the Hugging Face CDN
cdn_url = f"https://huggingface.co/{repo_id}/resolve/main/{filename}"
hf_hub_download(repo_id, filename, repo_type="dataset", cache_dir="./data")

# Load the downloaded dataset
with open(os.path.join("./data", filename), "r") as f:
    dataset = json.load(f)
```

We will also modify the `train.py` script to use the downloaded dataset instead of loading it from the Hugging Face API.

```python
import os
import json
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Load the downloaded dataset
with open(os.path.join("./data", "dataset.json"), "r") as f:
    dataset = json.load(f)

# Create a dataset class to load the data
class Dataset(torch.utils.data.Dataset):
    def __init__(self, dataset):
        self.dataset = dataset

    def __getitem__(self, idx):
        # Load the data and return it as a tensor
        data = self.dataset[idx]
        return {"input_ids": torch.tensor(data["input_ids"]), "labels": torch.tensor(data["labels"])}

    def __len__(self):
        return len(self.dataset)

# Create a dataset instance and data loader
dataset = Dataset(dataset)
data_loader = torch.utils.data.DataLoader(dataset, batch_size=32, shuffle=True)

# Train the model using the data loader
model = AutoModelForSequenceClassification.from_pretrained("model/repo")
tokenizer = AutoTokenizer.from_pretrained("model/repo")

for epoch in range(5):
    for batch in data_loader:
        # Train the model on the batch
        input_ids = batch["input_ids"].to(device)
        labels = batch["labels"].to(device)
        optimizer = torch.optim.Adam(model.parameters(), lr=1e-5)

        # Zero the gradients
        optimizer.zero_grad()

        # Forward pass
        outputs = model(input_ids, labels=labels)
        loss = outputs.loss

        # Backward pass
        loss.backward()

        # Update the model parameters
        optimizer.step()
```

### Verification
To verify that the CDN bypass is working, we can check the dataset download times and the training times. We can also check the Hugging Face API logs to ensure that the rate limits are not being exceeded.

We can add some logging statements to the `data_ingestion.py` script to measure the dataset download times.

```python
import time
import logging

# Define the logger
logger = logging.getLogger(__name__)

# Download the dataset from the Hugging Face CDN
start_time = time.time()
cdn_url = f"https://huggingface.co/{repo_id}/resolve/main/{filename}"
hf_hub_download(repo_id, filename, repo_type="dataset", cache_dir="./data")
end_time = time.time()

# Log the download time
logger.info(f"Dataset downloaded in {end_time - start_time} seconds")
```

We can also add some logging statements to the `train.py` script to measure the training times.

```python
import time
import logging

# Define the logger
logger = logging.getLogger(__name__)

# Train the model using the data loader
start_time = time.time()
for epoch in range(5):
    for batch in data_loader:
        # Train the model on the batch
        input_ids = batch["input_ids"].to(device)
        labels = batch["labels"].to(device)
        optimizer = torch.optim.Adam(model.parameters(), lr=1e-5)

        # Zero the gradients
        optimizer.zero_grad()

        # Forward pass
        outputs = model(input_ids, labels=labels)
        loss = outputs.loss

        # Backward pass
        loss.backward()

        # Update the model parameters
        optimizer.step()
end_time = time.time()

# Log the training time
logger.info(f"Model trained in {end_time - start_time} seconds")
```

By checking the logs, we can verify that the CDN bypass is working and that the dataset download times and training times are improved.
