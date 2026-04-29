"""Push cleaned v2 datasets to HF Hub for training scripts to consume.

Reads v2-clean/v2-{sft,tools,agent,dpo}/clean.jsonl and pushes to:
  - axentx/surrogate-1-v2-train  (SFT data Stages 1)
  - axentx/surrogate-1-v2-tools  (Stage 1.5)
  - axentx/surrogate-1-v2-agent  (Stage 1.6)
  - axentx/surrogate-1-v2-dpo    (Stage 2)
"""
import os, json
from pathlib import Path
from huggingface_hub import HfApi, create_repo

api = HfApi(token=os.environ.get("HF_TOKEN"))

DATA = Path.home() / ".surrogate/data/v2-clean"

PUSH_MAP = {
    "v2-sft":   "axentx/surrogate-1-v2-train",
    "v2-tools": "axentx/surrogate-1-v2-tools",
    "v2-agent": "axentx/surrogate-1-v2-agent",
    "v2-dpo":   "axentx/surrogate-1-v2-dpo",
}

for category, repo_id in PUSH_MAP.items():
    src = DATA / category / "clean.jsonl"
    if not src.exists():
        print(f"⚠ skip {category}: {src} missing")
        continue

    # Create dataset repo (private — these are derived works)
    try:
        create_repo(repo_id, repo_type="dataset", private=True, exist_ok=True,
                    token=os.environ.get("HF_TOKEN"))
    except Exception as e:
        print(f"  create_repo {repo_id} err: {e}")

    # Convert to chat_template format if needed (Hermes XML for tools)
    out_path = src.parent / "chat_template.jsonl"
    with open(src) as fin, open(out_path, "w") as fout:
        for line in fin:
            if not line.strip(): continue
            try: obj = json.loads(line)
            except Exception: continue
            # Convert {prompt, response} → {messages: [...]}
            messages = [
                {"role": "user", "content": obj["prompt"]},
                {"role": "assistant", "content": obj["response"]},
            ]
            fout.write(json.dumps({"messages": messages}, ensure_ascii=False) + "\n")

    # Upload
    try:
        api.upload_file(
            path_or_fileobj=str(out_path),
            path_in_repo="train.jsonl",
            repo_id=repo_id,
            repo_type="dataset",
            commit_message=f"v2 build: {category} clean+sanitized+deduped+decontaminated"
        )
        print(f"✅ pushed {category} → {repo_id}")
    except Exception as e:
        print(f"❌ push {repo_id} failed: {e}")

print("\n✅ all datasets pushed")
