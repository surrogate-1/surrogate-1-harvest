# axiomops / backend

### Synthesized Implementation Plan for HF CDN Bypass Pattern

The highest-value incremental improvement that can ship in <2h is to implement the HF CDN Bypass pattern for the AxiomOps project. This involves modifying the training script to download dataset files directly from the HF CDN, bypassing the API rate limit.

#### Implementation Plan

1. **Identify the dataset repository**: Determine the HF dataset repository used by the AxiomOps project.
2. **Get the list of file paths**: Use the `list_repo_tree` API to get the list of file paths for the dataset repository. This can be done using a single API call.
3. **Save the list of file paths to a JSON file**: Save the list of file paths to a JSON file that can be embedded in the training script.
4. **Modify the training script**: Modify the training script to download the dataset files directly from the HF CDN using the list of file paths from the JSON file.
5. **Test the modified training script**: Test the modified training script to ensure that it can download the dataset files successfully and train the model without hitting the API rate limit.

#### Code Snippets

```bash
# Get the list of file paths using the list_repo_tree API
api_call=$(curl -X GET \
  https://huggingface.co/api/v1/repo/tree \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"repo_id": "your_repo_id", "path": "your_path", "recursive": false}')
# Save the list of file paths to a JSON file
echo $api_call > file_paths.json
```

```python
# Modify the training script to download dataset files from the HF CDN
import json
import requests

# Load the list of file paths from the JSON file
with open('file_paths.json') as f:
  file_paths = json.load(f)

# Download the dataset files from the HF CDN
for file_path in file_paths:
  file_url = f"https://huggingface.co/datasets/{file_path}/resolve/main/{file_path}"
  response = requests.get(file_url)
  with open(file_path, 'wb') as f:
    f.write(response.content)

# Train the model using the downloaded dataset files
import torch
from transformers import AutoModelForSequenceClassification

# Load the dataset files
file_list = json.load(open("file_paths.json", "r"))

# Create a dataset class to load the files
class Dataset(torch.utils.data.Dataset):
  def __init__(self, file_list):
    self.file_list = file_list

  def __getitem__(self, idx):
    file = self.file_list[idx]
    with open(file, "r") as f:
      text = f.read()
    return {"text": text}

  def __len__(self):
    return len(self.file_list)

# Create a dataset instance
dataset = Dataset(file_list)

# Create a data loader
data_loader = torch.utils.data.DataLoader(dataset, batch_size=32)

# Train a model using the data loader
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
for batch in data_loader:
  input_ids = batch["text"].to(device)
  labels = batch["labels"].to(device)
  optimizer = torch.optim.Adam(model.parameters(), lr=1e-5)
  loss = model(input_ids, labels=labels)
  loss.backward()
  optimizer.step()
```

#### Expected Outcome

The implementation of the HF CDN Bypass pattern is expected to reduce the API rate limit errors and improve the overall performance of the AxiomOps project. The modified training script should be able to download the dataset files directly from the HF CDN and train the model without hitting the API rate limit.

**Action Items:**

1. Identify the dataset repository used by the AxiomOps project.
2. Get the list of file paths using the `list_repo_tree` API.
3. Save the list of file paths to a JSON file.
4. Modify the training script to download the dataset files directly from the HF CDN.
5. Test the modified training script to ensure that it can download the dataset files successfully and train the model without hitting the API rate limit.

**Timeline:**

* Identify the dataset repository: 15 minutes
* Get the list of file paths: 15 minutes
* Save the list of file paths to a JSON file: 15 minutes
* Modify the training script: 30 minutes
* Test the modified training script: 30 minutes

Total estimated time: 2 hours
