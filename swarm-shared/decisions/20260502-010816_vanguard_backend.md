# vanguard / backend

### Diagnosis
* The Vanguard project lacks a comprehensive README file, making it difficult for new developers to understand the project's purpose, context, and functionality.
* The absence of a README file hinders the onboarding process for new team members and makes it challenging for them to contribute to the project.
* The project's backend focus suggests that improvements to the project's infrastructure, such as API rate limit handling, dataset ingestion, and training pipeline efficiency, could have a significant impact on the project's overall performance and scalability.
* The recent commits and swarm-shared decisions indicate that the project is still in its early stages, and addressing the lack of documentation and infrastructure improvements could help establish a solid foundation for future development.
* The project's use of Hugging Face APIs and Lightning AI suggests that optimizing API usage, handling rate limits, and leveraging CDN bypass techniques could improve the project's efficiency and reduce costs.

### Proposed change
The proposed change is to create a comprehensive README file for the Vanguard project, focusing on the backend aspects, and to implement improvements to the project's infrastructure, such as optimizing API usage and handling rate limits.

### Implementation
1. Create a new file `README.md` in the project root directory (`/opt/axentx/vanguard`) with the following content:
```markdown
# Vanguard Project
## Overview
The Vanguard project is a backend-focused project that utilizes Hugging Face APIs and Lightning AI to [briefly describe the project's purpose and functionality].

## Getting Started
To get started with the project, please follow these steps:
* Install the required dependencies: [list dependencies]
* Set up the Hugging Face API credentials: [provide instructions]
* Configure the Lightning AI environment: [provide instructions]

## API Usage
The project uses the Hugging Face API to [briefly describe the API usage]. To optimize API usage and handle rate limits, the project will implement the following strategies:
* Use the CDN bypass technique to download dataset files directly from the CDN
* Implement a rate limit handler to pause API requests when the rate limit is exceeded
* Use the `list_repo_tree` method to retrieve file paths instead of `list_repo_files`

## Training Pipeline
The project's training pipeline will be optimized to reduce costs and improve efficiency. The pipeline will:
* Use the Lightning AI environment to train models
* Leverage the CDN bypass technique to download dataset files directly from the CDN
* Implement a studio reuse strategy to reduce the number of studios created
```
2. Implement the CDN bypass technique by modifying the `train.py` script to download dataset files directly from the CDN:
```python
import requests

# Define the dataset repository and file path
repo_id = "dataset/repo"
file_path = "path/to/file"

# Download the file from the CDN
url = f"https://huggingface.co/datasets/{repo_id}/resolve/main/{file_path}"
response = requests.get(url)

# Save the file to the local directory
with open(file_path, "wb") as f:
    f.write(response.content)
```
3. Implement a rate limit handler to pause API requests when the rate limit is exceeded:
```python
import time

# Define the rate limit threshold
rate_limit_threshold = 1000

# Define the pause duration
pause_duration = 360

# Get the current rate limit status
rate_limit_status = get_rate_limit_status()

# Check if the rate limit is exceeded
if rate_limit_status["remaining"] < rate_limit_threshold:
    # Pause the API requests for the specified duration
    time.sleep(pause_duration)
```
### Verification
To verify that the changes work as expected, follow these steps:
1. Create a new branch and merge the changes into the branch.
2. Run the `train.py` script to test the CDN bypass technique and rate limit handler.
3. Monitor the API usage and rate limit status to ensure that the changes are effective.
4. Verify that the studio reuse strategy is working correctly by checking the number of studios created.
5. Test the project's functionality and performance to ensure that the changes have not introduced any regressions.
