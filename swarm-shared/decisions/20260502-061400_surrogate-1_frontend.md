# surrogate-1 / frontend

**Diagnosis**
* The project lacks a robust implementation for handling Hugging Face API rate limits, which can block dataset training.
* There is inadequate reuse of existing Lightning Studio instances, leading to wasted quota and potential downtime.
* The project does not have a frontend-focused implementation for handling Hugging Face API rate limits, which can block dataset training.

**Proposed change**
* Implement a frontend-focused solution to handle Hugging Face API rate limits by leveraging the HF CDN bypass pattern.

**Implementation**
1. In the `/opt/axentx/surrogate-1/frontend` directory, create a new file called `cdn_bypass.js`.
2. In `cdn_bypass.js`, implement the following logic:
```javascript
const axios = require('axios');

async function getFilesFromCdn(repo, path) {
  const url = `https://huggingface.co/datasets/${repo}/resolve/main/${path}`;
  const response = await axios.get(url);
  return response.data;
}

async function listRepoTree(repo, path) {
  const url = `https://huggingface.co/datasets/${repo}/resolve/main/${path}`;
  const response = await axios.get(url);
  const tree = response.data;
  return tree;
}

async function main() {
  const repo = 'your-repo-name';
  const path = 'your-path';
  const files = await getFilesFromCdn(repo, path);
  console.log(files);
}

main();
```
3. In the `frontend` directory, create a new file called `train.py`.
4. In `train.py`, import the `cdn_bypass` module and use the `getFilesFromCdn` function to fetch files from the Hugging Face CDN:
```python
import cdn_bypass

def train():
  repo = 'your-repo-name'
  path = 'your-path'
  files = cdn_bypass.getFilesFromCdn(repo, path)
  # Use the fetched files for training
  pass

train()
```
5. Update the `train.py` file to use the `listRepoTree` function to fetch the repository tree:
```python
import cdn_bypass

def train():
  repo = 'your-repo-name'
  path = 'your-path'
  tree = cdn_bypass.listRepoTree(repo, path)
  # Use the fetched tree for training
  pass

train()
```
**Verification**
1. Run the `train.py` script to verify that the frontend-focused implementation for handling Hugging Face API rate limits works correctly.
2. Check the console output to ensure that the files are fetched correctly from the Hugging Face CDN.
3. Verify that the `listRepoTree` function returns the expected repository tree.
