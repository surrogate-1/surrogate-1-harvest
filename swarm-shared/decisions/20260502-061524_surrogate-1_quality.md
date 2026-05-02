# surrogate-1 / quality

**Diagnosis**
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* There is inadequate reuse of existing Lightning Studio instances, leading to wasted quota and potential downtime.
* The project does not efficiently handle file paths for dataset training, leading to potential rate limit issues.
* The existing implementation does not properly handle file schema for dataset training, leading to potential errors.

**Proposed change**
* Implement a robust Hugging Face API rate limit handling mechanism to prevent dataset training blockages.

**Implementation**
```bash
# Create a new file: `src/hf_api_rate_limiter.py`
# src/hf_api_rate_limiter.py
import time

class HFRateLimiter:
    def __init__(self, api_limit=1000, window=300):
        self.api_limit = api_limit
        self.window = window
        self.reset_time = time.time()

    def is_allowed(self):
        current_time = time.time()
        elapsed_time = current_time - self.reset_time
        if elapsed_time < self.window:
            return False
        self.reset_time = current_time
        return True

    def wait_before_retry(self):
        if not self.is_allowed():
            time.sleep(self.window - (time.time() - self.reset_time))

# Update `src/train.py` to use the rate limiter
# src/train.py
import src.hf_api_rate_limiter as hf_rate_limiter

# ...

def list_repo_files(repo, path):
    if not hf_rate_limiter.HFRateLimiter().is_allowed():
        hf_rate_limiter.HFRateLimiter().wait_before_retry()
    # ...

# Update `src/ingestion.py` to use the rate limiter
# src/ingestion.py
import src.hf_api_rate_limiter as hf_rate_limiter

# ...

def download_dataset_files(repo, path):
    if not hf_rate_limiter.HFRateLimiter().is_allowed():
        hf_rate_limiter.HFRateLimiter().wait_before_retry()
    # ...
```

**Verification**
* Run `src/train.py` and `src/ingestion.py` with a large dataset to test the rate limiter.
* Monitor the API rate limit logs to ensure the limiter is functioning correctly.
* Verify that the dataset training and ingestion processes complete successfully without hitting the API rate limit.
