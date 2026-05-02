# axiomops / quality

### Highest-Value Incremental Improvement
The highest-value incremental improvement that can be shipped in under 2 hours is to implement a fix for the HF API rate limit issue. This issue is currently blocking dataset training and can be resolved by utilizing the HF CDN bypass.

### Implementation Plan
1. **Identify the affected scripts**: Locate the scripts that are currently using the HF API to download dataset files.
2. **Modify the scripts to use HF CDN**: Update the scripts to download dataset files from the HF CDN instead of the HF API. This can be done by replacing the API endpoint with the CDN endpoint (`https://huggingface.co/datasets/{repo}/resolve/main/{path}`).
3. **Remove Authorization header**: Remove the Authorization header from the requests to the HF CDN, as it is not required.
4. **Test the modified scripts**: Test the modified scripts to ensure that they are working correctly and downloading the dataset files from the HF CDN.

### Code Snippet
```bash
# Before
hf_api_endpoint="https://huggingface.co/api/v1/datasets/{repo}/files/{path}"
headers={"Authorization": "Bearer {token}"}

# After
hf_cdn_endpoint="https://huggingface.co/datasets/{repo}/resolve/main/{path}"
headers={}

# Download dataset file from HF CDN
curl -X GET "${hf_cdn_endpoint}" -H "${headers}" -o dataset_file.parquet
```
### Expected Outcome
By implementing this fix, the HF API rate limit issue will be resolved, and dataset training will no longer be blocked. This will improve the overall performance and reliability of the AxiomOps platform.
