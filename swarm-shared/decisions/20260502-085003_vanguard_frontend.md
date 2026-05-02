# vanguard / frontend

### 1. **Diagnosis**
* The Vanguard project lacks a comprehensive frontend solution to handle HF API rate limits, which can block dataset training and hinder the project's progress.
* The current implementation does not utilize the HF CDN bypass strategy, which can download public dataset files without hitting the API rate limit.
* The frontend code does not pre-list file paths once and embed them in the training script, resulting in repeated API calls and potential rate limit issues.
* The project does not reuse existing Lightning Studios, leading to wasted quota and potential training interruptions.
* The frontend does not handle Lightning idle stop kills training, which can cause training processes to die unexpectedly.

### 2. **Proposed change**
The proposed change will focus on implementing the HF CDN bypass strategy in the frontend code, specifically in the file responsible for downloading dataset files. The scope of the change will be limited to the `dataset_downloader.js` file, which is assumed to be located in the `/opt/axentx/vanguard/frontend/src` directory.

### 3. **Implementation**
To implement the HF CDN bypass strategy, the following steps will be taken:
```javascript
// dataset_downloader.js
import axios from 'axios';

const DATASET_REPO = 'https://huggingface.co/datasets';
const DATASET_PATH = '/resolve/main/';

async function downloadDatasetFile(slug, filePath) {
  const url = `${DATASET_REPO}/${slug}${DATASET_PATH}${filePath}`;
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

export async function downloadDataset(slug, files) {
  const promises = files.map((file) => downloadDatasetFile(slug, file));
  await Promise.all(promises);
}
```
The `downloadDatasetFile` function will be used to download individual dataset files using the HF CDN bypass strategy. The `downloadDataset` function will be used to download multiple files in parallel.

### 4. **Verification**
To verify that the implementation works, the following steps can be taken:
1. Run the `downloadDataset` function with a sample dataset slug and file list.
2. Verify that the files are downloaded correctly and without hitting the API rate limit.
3. Check the network requests made by the frontend code to ensure that they are using the HF CDN bypass strategy.
4. Test the implementation with different dataset slugs and file lists to ensure that it works correctly in all scenarios.
