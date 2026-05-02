# vanguard / frontend

### 1. **Diagnosis**
* The Vanguard project lacks a comprehensive solution to handle HF API rate limits, which can block dataset training and hinder the project's progress.
* The current implementation does not utilize the HF CDN bypass strategy, which can download public dataset files without API rate limits.
* The frontend does not have a mechanism to pre-list file paths once and embed them in the training script, which can reduce API calls during data loading.
* The project does not have a README file, which can make it difficult for new contributors to understand the project's purpose and setup.
* The project's recent commits suggest a focus on ops, quality, and discovery cycles, but do not address the frontend's limitations.

### 2. **Proposed change**
The proposed change is to implement the HF CDN bypass strategy in the frontend by pre-listing file paths once and embedding them in the training script. This change will be made in the `train.py` file, which is responsible for loading the dataset and training the model.

### 3. **Implementation**
To implement the HF CDN bypass strategy, we will make the following changes:
```python
# train.py
import json
import os

# Pre-list file paths once and save to JSON
def pre_list_file_paths(repo, path):
    file_paths = []
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        if os.path.isfile(file_path):
            file_paths.append(file_path)
    with open('file_paths.json', 'w') as f:
        json.dump(file_paths, f)

# Load file paths from JSON and use CDN bypass
def load_dataset(repo, path):
    with open('file_paths.json', 'r') as f:
        file_paths = json.load(f)
    dataset = []
    for file_path in file_paths:
        # Use CDN bypass to download file
        file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
        # Download file and add to dataset
        dataset.append(download_file(file_url))
    return dataset

# Download file using CDN bypass
def download_file(file_url):
    import requests
    response = requests.get(file_url)
    return response.content

# Update train function to use CDN bypass
def train():
    repo = "your-repo"
    path = "your-path"
    pre_list_file_paths(repo, path)
    dataset = load_dataset(repo, path)
    # Train model using dataset
    model = train_model(dataset)
    return model
```
We will also add a README file to the project with instructions on how to setup and run the project.

### 4. **Verification**
To verify that the HF CDN bypass strategy is working, we can check the following:
* The `file_paths.json` file is created and contains the correct file paths.
* The dataset is loaded correctly using the CDN bypass strategy.
* The model is trained successfully using the loaded dataset.
* The API rate limits are no longer exceeded during data loading.
We can verify these checks by running the `train.py` file and monitoring the output and logs.
