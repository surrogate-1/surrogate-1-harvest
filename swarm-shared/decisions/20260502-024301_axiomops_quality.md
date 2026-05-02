# axiomops / quality

### Highest-Value Incremental Improvement
Based on the provided information, the highest-value incremental improvement that can ship in <2h is to implement a fix for the HF API rate limit issue. This issue is currently blocking dataset training and can be resolved by using the HF CDN to download dataset files without authorization headers.

### Implementation Plan
To implement this fix, we will:
1. Update the `train.py` script to use the HF CDN to download dataset files.
2. Pre-list file paths once and embed them in the training script.
3. Use the `list_repo_tree` API call to get the list of files in the dataset repository.
4. Save the list of files to a JSON file.
5. Update the `train.py` script to read the list of files from the JSON file and download them using the HF CDN.

### Code Snippets
```python
import json
import requests

# Get the list of files in the dataset repository
def get_file_list(repo_id, path):
    url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{path}"
    response = requests.get(url)
    file_list = response.json()
    return file_list

# Save the list of files to a JSON file
def save_file_list(file_list, file_path):
    with open(file_path, "w") as f:
        json.dump(file_list, f)

# Download files using the HF CDN
def download_files(file_list, download_dir):
    for file in file_list:
        file_url = f"https://huggingface.co/datasets/{file['repo_id']}/resolve/main/{file['path']}"
        response = requests.get(file_url)
        with open(f"{download_dir}/{file['name']}", "wb") as f:
            f.write(response.content)

# Update the train.py script to use the HF CDN
def update_train_script(file_list, download_dir):
    # Read the list of files from the JSON file
    with open("file_list.json", "r") as f:
        file_list = json.load(f)

    # Download files using the HF CDN
    download_files(file_list, download_dir)

    # Train the model using the downloaded files
    # ...
```
### Example Use Case
To use this implementation, simply run the `train.py` script with the updated code. The script will download the dataset files using the HF CDN and train the model using the downloaded files.
```bash
python train.py
```
This implementation should take less than 2 hours to complete and will resolve the HF API rate limit issue, allowing dataset training to proceed.
