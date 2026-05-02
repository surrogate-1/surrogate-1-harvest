# axiomops / discovery

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training.

### Implementation Plan
1. **Identify Dataset Repositories**: List the dataset repositories used in the AxiomOps project that are currently being rate-limited.
2. **Modify Training Scripts**: Update the training scripts to use the HF CDN Bypass pattern by downloading dataset files directly from the CDN using the `https://huggingface.co/datasets/{repo}/resolve/main/{path}` URL pattern.
3. **Embed File List in Training Script**: Pre-list the file paths for each dataset repository using a single API call to `list_repo_tree(path, recursive=False)` and embed the list in the training script.
4. **Update Dataset Loading**: Modify the dataset loading code to use the CDN URLs and file list embedded in the training script.

### Code Snippets
```python
import requests

# Define the dataset repository and file path
repo = "dataset-repo"
file_path = "path/to/file.parquet"

# Download the file directly from the CDN
cdn_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
response = requests.get(cdn_url)

# Load the dataset file
dataset = pd.read_parquet(response.content)
```

```python
# Pre-list the file paths for the dataset repository
import requests

repo = "dataset-repo"
date_folder = "2023-03-01"

# Get the list of files in the date folder
response = requests.get(f"https://huggingface.co/datasets/{repo}/tree/main/{date_folder}")
file_list = response.json()

# Embed the file list in the training script
file_list = [f"https://huggingface.co/datasets/{repo}/resolve/main/{date_folder}/{file}" for file in file_list]
```

### Example Use Case
To train a model using the AxiomOps dataset, update the training script to use the HF CDN Bypass pattern:
```python
# Train a model using the AxiomOps dataset
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Load the dataset using the HF CDN Bypass pattern
file_list = [...]  # Embedded file list
dataset = pd.concat([pd.read_parquet(requests.get(file).content) for file in file_list])

# Split the dataset into training and testing sets
train_data, test_data = train_test_split(dataset, test_size=0.2, random_state=42)

# Train a random forest classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(train_data.drop("target", axis=1), train_data["target"])
```
