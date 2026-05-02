# surrogate-1 / quality

### Diagnosis
* The project lacks a robust implementation for data ingestion and training, relying heavily on the Hugging Face API with rate limits.
* There is inadequate reuse of existing Lightning Studio instances, leading to wasted quota and potential training interruptions.
* The project does not fully utilize the HF CDN bypass, resulting in unnecessary API calls and potential rate limit issues.
* The training pipeline is not optimized for performance, with potential bottlenecks in data loading and processing.
* There is no clear strategy for handling errors and exceptions in the training pipeline, which could lead to crashes or inconsistent results.

### Proposed change
The proposed change is to implement a comprehensive solution that addresses the identified issues. This will involve:
* Creating a new script, `ingest_data.py`, to handle data ingestion using the HF CDN bypass.
* Modifying the `train.py` script to reuse existing Lightning Studio instances and optimize data loading and processing.
* Implementing error handling and exception handling mechanisms in the training pipeline.

### Implementation
The implementation will involve the following steps:

1. Create a new script, `ingest_data.py`, with the following code:
```python
import requests
import json

def ingest_data(repo, path):
    # Use HF CDN bypass to download data
    url = f"https://huggingface.co/datasets/{repo}/resolve/main/{path}"
    response = requests.get(url)
    data = response.json()
    return data

def main():
    repo = "axentx/surrogate-1"
    path = "data/train.json"
    data = ingest_data(repo, path)
    with open("data/train.json", "w") as f:
        json.dump(data, f)

if __name__ == "__main__":
    main()
```
2. Modify the `train.py` script to reuse existing Lightning Studio instances and optimize data loading and processing:
```python
import lightning as L
import torch
from ingest_data import ingest_data

def train(model, data):
    # Reuse existing Lightning Studio instance
    studio = L.Studio()
    for s in studio.studios:
        if s.name == "surrogate-1" and s.status == "Running":
            studio = s
            break
    else:
        studio = L.Studio(create_ok=True)

    # Optimize data loading and processing
    data = ingest_data("axentx/surrogate-1", "data/train.json")
    data = torch.tensor(data)
    model.train()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    for epoch in range(10):
        optimizer.zero_grad()
        outputs = model(data)
        loss = torch.nn.MSELoss()(outputs, data)
        loss.backward()
        optimizer.step()

def main():
    model = torch.nn.Linear(5, 3)
    train(model, None)

if __name__ == "__main__":
    main()
```
3. Implement error handling and exception handling mechanisms in the training pipeline:
```python
try:
    train(model, data)
except Exception as e:
    print(f"Error: {e}")
    # Handle exception
```
### Verification
To verify that the proposed change works, we can run the `ingest_data.py` script to ingest the data and then run the `train.py` script to train the model. We can check the output of the `train.py` script to ensure that it is producing the expected results. Additionally, we can monitor the Lightning Studio instance to ensure that it is being reused correctly. We can also check the API calls to ensure that the HF CDN bypass is being used correctly.
