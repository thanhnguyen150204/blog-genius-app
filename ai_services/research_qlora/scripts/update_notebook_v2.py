"""
One-time script to update train_qlora.ipynb for Model v2 dataset.
"""
import json
from pathlib import Path

nb_path = Path(__file__).parent.parent / "training" / "train_qlora.ipynb"

with open(nb_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

# 1. Update title/description cell
nb["cells"][0]["source"] = [
    "# QLoRA Fine-Tuning v2: Qwen2.5-1.5B-Instruct for SEO & GEO Pipeline\n",
    "**Project:** AI SEO & GEO Blog Builder (Module 1 — Research & Content Brief) — **Model v2**\n",
    "**Hardware:** Google Colab Free Tier (1x NVIDIA T4 GPU - 15GB VRAM)\n",
    "\n",
    "## Nâng cấp v2 so với v1\n",
    "| Hạng mục | v1 | v2 |\n",
    "|---|---|---|\n",
    "| Tổng mẫu train | 1,948 | ~2,430 |\n",
    "| Tỷ lệ tiếng Việt | 35% | 50% |\n",
    "| Số niches | 14 | 34 |\n",
    "| Intent rules trong prompt | ❌ | ✅ Explicit + examples |\n",
    "| known_intent trong CB | 33% | 60% |\n",
    "\n",
    "**Hướng dẫn:** Upload `train_v2.jsonl` và `test_v2.jsonl` vào `/content/` trước khi chạy.",
]

# 2. Update dataset loading cell: train.jsonl -> train_v2.jsonl, test.jsonl -> test_v2.jsonl
for cell in nb["cells"]:
    if cell.get("cell_type") != "code":
        continue
    src = cell.get("source", [])
    if isinstance(src, list):
        joined = "".join(src)
    else:
        joined = src
    if 'train": "train.jsonl"' in joined and 'test": "test.jsonl"' in joined and "load_dataset" in joined:
        updated = joined.replace('"train": "train.jsonl"', '"train": "train_v2.jsonl"')
        updated = updated.replace('"test": "test.jsonl"', '"test": "test_v2.jsonl"')
        lines = updated.split("\n")
        cell["source"] = [l + "\n" for l in lines[:-1]] + [lines[-1]]
        print("[UPDATED] Dataset loading cell -> train_v2.jsonl / test_v2.jsonl")
        break

with open(nb_path, "w", encoding="utf-8") as f:
    json.dump(nb, f, ensure_ascii=False, indent=1)

print(f"[SUCCESS] {nb_path.name} updated for v2 dataset.")
