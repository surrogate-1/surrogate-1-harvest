# axiomops / backend

### Synthesized Implementation of HF CDN Bypass Pattern for AxiomOps Project

The highest-value incremental improvement that can be shipped in under 2 hours for the AxiomOps project is to implement the HF CDN Bypass pattern to avoid rate-limit blocks during dataset training. This improvement can be achieved by modifying the dataset training script to download dataset files directly from the Hugging Face CDN, bypassing the API rate limit.

#### Implementation Plan

1. **Identify the dataset repository and path**: Determine the Hugging Face dataset repository and path that is being used for training.
2. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` to retrieve the list of file paths for the desired dataset.
3. **Save file paths to JSON**: Save the list of file paths to a JSON file that can be embedded in the training script.
4. **Update the training script to use CDN-only fetches**: Modify the script to use the CDN-only fetches with zero API calls during data load.
5. **Test the implementation**: Test the implementation to ensure that it works as expected.

#### Code Snippets

```python
import json
import requests

# Define the dataset repository and path
repo = "axentx/axiomops-dataset"
path = "data/train"

# Pre-list file paths using a single API call
response = requests.get(f"https://huggingface.co/api/v1/datasets/{repo}/tree?path={path}&recursive=false")
file_paths = response.json()["files"]

# Save file paths to JSON
with open("file_paths.json", "w") as f:
    json.dump(file_paths, f)

# Update the training script to use CDN-only fetches
def load_dataset():
    with open("file_paths.json", "r") as f:
        file_paths = json.load(f)
    dataset = []
    for file_path in file_paths:
        file_url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
        response = requests.get(file_url)
        dataset.append(response.content)
    return dataset
```

#### Expected Outcome

By implementing the HF CDN Bypass pattern, the AxiomOps project can avoid rate-limit blocks during dataset training, reducing the likelihood of training interruptions and improving overall system reliability. This incremental improvement can be shipped in under 2 hours, providing a significant benefit to the project.

#### Example Use Case

To use the HF CDN Bypass pattern, simply run the modified training script. The script will download the dataset files from the Hugging Face CDN instead of using the Hugging Face API, avoiding rate-limit blocks.

#### Tags

#huggingface #cdn #rate-limit-bypass #training #axiomops

Note: The implementation plan and code snippets are based on the assumption that the Hugging Face API is being used to download the dataset files. The actual implementation may vary depending on the specific use case and requirements.
