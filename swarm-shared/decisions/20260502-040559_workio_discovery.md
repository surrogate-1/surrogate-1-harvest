# workio / discovery

### Synthesized High-Value Incremental Improvement for Workio Discovery

#### Diagnosis
The Workio project requires enhancements in its discovery process to improve the overall system's functionality, efficiency, and user experience. Based on the patterns and lessons learned, the highest-value incremental improvement that can be shipped in under 2 hours involves optimizing the business research process with the knowledge graph pipeline, implementing a more efficient data ingestion pipeline, and leveraging the HF CDN bypass pattern.

#### Implementation Plan
To achieve this, we will focus on the following steps:

1. **Review Top-Hub Doc Insight**: Before planning tasks, review the most-connected hub (e.g., "MOC") to gain contextual insights.
2. **Execute Knowledge-RAG**: Run the `granite-business-research.sh` script to perform market analysis, then execute `knowledge-rag` to query top hub and related documents for insights.
3. **Pre-list file paths**: Make a single API call to `list_repo_tree(path, recursive=False)` for one date folder and save the list to a JSON file.
4. **Embed file list in training script**: Modify the training script to read the pre-listed file paths from the JSON file and use them for data loading.
5. **Use CDN-only fetches**: Update the data loading process to use CDN-only fetches with zero API calls during data load.
6. **Optimize API Calls**: Pre-list file paths once and embed them in the training script to avoid API rate limits. Use the HF CDN bypass to download dataset files without authorization headers.
7. **Implement Studio Reuse**: Reuse existing Lightning Studios instead of recreating them to save 80hr/mo quota.

#### Code Snippets
```bash
# Run market analysis script
./granite-business-research.sh

# Execute knowledge-rag
knowledge-rag --query "top hub and related documents"

# Pre-list file paths
list_repo_tree=$(hf api list-repo-tree --path /datasets/{repo} --recursive False)
echo "$list_repo_tree" > file_paths.json

# Embed file list in training script
import json
with open('file_paths.json') as f:
    file_list = json.load(f)

# Use CDN-only fetches
for file in file_list:
    file_path = f"https://huggingface.co/datasets/{repo}/resolve/main/{file}"
    # Load data from CDN
    data = pd.read_parquet(file_path)
    # Process data
    # ...

# Implement studio reuse
for s in Teamspace.studios:
    if s.name == "X" and s.status == "Running":
        use_s = s
```

#### Expected Outcome
The implementation of these improvements will enhance the discovery process in Workio, providing better contextual insights, optimizing API calls, reducing costs associated with Lightning Studio usage, and improving the overall efficiency and scalability of the system. This change can be shipped in under 2 hours and will have a positive impact on the system's performance and user experience.

#### Next Steps
1. Implement the HF CDN Bypass and pre-list file paths in the data ingestion pipeline.
2. Reuse existing Lightning Studios in the training script.
3. Monitor the system's performance and adjust the implementation as needed.
4. Continuously review and refine the discovery process to ensure it meets the evolving needs of the users and the system.
