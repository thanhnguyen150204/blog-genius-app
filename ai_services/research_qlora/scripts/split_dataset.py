"""
Module: split_dataset.py
Description: Merges cleaned task datasets, shuffles with fixed seed, and splits into 90/10 train/test sets.
             Supports --v2 flag to output train_v2.jsonl / test_v2.jsonl for QLoRA Model v2.
"""

import argparse
import json
import random
from pathlib import Path


def split(data_dir: Path, seed: int = 42, v2: bool = False):
    kw_file = data_dir / "keyword_research.jsonl"
    cb_file = data_dir / "content_brief.jsonl"

    samples = []
    for f in [kw_file, cb_file]:
        if not f.exists():
            print(f"[WARN] File not found: {f}")
            continue
        with f.open("r", encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if line:
                    samples.append(json.loads(line))

    if not samples:
        print("[ERROR] No samples found. Run validate_dataset.py first.")
        return

    random.seed(seed)
    random.shuffle(samples)

    split_idx = int(len(samples) * 0.90)
    train = samples[:split_idx]
    test = samples[split_idx:]

    suffix = "_v2" if v2 else ""
    for name, subset in [(f"train{suffix}", train), (f"test{suffix}", test)]:
        out = data_dir / f"{name}.jsonl"
        with out.open("w", encoding="utf-8") as f:
            for s in subset:
                f.write(json.dumps(s, ensure_ascii=False) + "\n")
        print(f"[SUCCESS] Wrote {len(subset)} samples to {out}")

    print(f"[INFO] Dataset split complete: {len(train)} train | {len(test)} test | {len(samples)} total")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split dataset into train and test sets")
    parser.add_argument("--data-dir", default="../data/", help="Directory containing cleaned JSONL files")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    parser.add_argument("--v2", action="store_true", help="Output as train_v2.jsonl / test_v2.jsonl")
    args = parser.parse_args()
    split(Path(args.data_dir), args.seed, args.v2)
