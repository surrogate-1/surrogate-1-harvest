# surrogate-1 / quality

### Synthesized Solution

The synthesized solution combines the strongest insights from the three candidate proposals to address the identified issues with the surrogate-1 model training pipeline. The main goals are to implement the HF CDN bypass, reduce API calls, and reuse existing Lightning Studios to improve the pipeline's robustness and efficiency.

#### Diagnosis

* The project lacks a robust implementation to handle data ingestion and training for the surrogate-1 model, relying heavily on the Hugging Face API with rate limits that can block dataset training.
* The current implementation does not utilize the HF CDN bypass to download dataset files, resulting in unnecessary API calls and rate limit issues.
* The project does not properly reuse existing Lightning Studios, leading to wasted resources and quota limitations.

#### Proposed Change

To address the identified issues, we will implement the HF CDN bypass and ensure proper reuse of existing Lightning Studios. The proposed change will focus on modifying the `train.py` script to utilize the HF CDN bypass and reuse existing Lightning Studios.

#### Implementation

1. **HF CDN Bypass**:
   - Create a new function `download_dataset_files` that uses the HF CDN bypass to download dataset files.
   - This function will take the dataset repository and file path as input and return the downloaded file.

   ```python
   import requests

   def download_dataset_files(repo, file_path):
       url = f"https://huggingface.co/datasets/{repo}/resolve/main/{file_path}"
       response = requests.get(url)
       return response.content
   ```

2. **Modify `train.py`**:
   - Update the `train.py` script to use the `download_dataset_files` function to download dataset files.
   - This will reduce API calls and avoid rate limit issues.

   ```python
   import json

   # Load dataset file list from JSON
   with open("dataset_file_list.json", "r") as f:
       dataset_file_list = json.load(f)

   # Download dataset files using HF CDN bypass
   for file in dataset_file_list:
       file_content = download_dataset_files("dataset_repo", file)
       # Process file content
   ```

3. **Reuse Existing Lightning Studios**:
   - Update the Lightning Studio creation script to reuse existing studios.
   - This will avoid quota limitations and reduce resource waste.

   ```python
   import lightning

   # List existing studios
   studios = lightning.Teamspace.studios

   # Reuse existing studio or create a new one
   for studio in studios:
       if studio.name == "surrogate-1" and studio.status == "Running":
           studio_to_use = studio
           break
   else:
       studio_to_use = lightning.Studio.create("surrogate-1")

   # Use the reused studio for training
   studio_to_use.run()
   ```

#### Verification

To confirm that the changes work as expected, you can:

1. Verify that the `download_dataset_files` function can successfully download dataset files using the HF CDN bypass.
2. Check that the `train.py` script can use the downloaded dataset files and reduce API calls.
3. Confirm that the Lightning Studio creation script can reuse existing studios and avoid quota limitations.
4. Monitor the project's performance and resource usage to ensure that the implemented changes have improved the overall quality and efficiency of the surrogate-1 model training pipeline.

By implementing these changes, you should be able to improve the robustness and efficiency of the surrogate-1 model training pipeline.
