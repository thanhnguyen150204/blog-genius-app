"""
Module: validate_dataset.py
Description: Validates, deduplicates, and filters raw ChatML dataset into clean format.
"""

import argparse
import hashlib
import json
from pathlib import Path

INTENT_ENUM = {"Informational", "Commercial", "Transactional", "Navigational"}
FUNNEL_ENUM = {"TOFU", "MOFU", "BOFU"}
CONTENT_TYPE_ENUM = {"Informational", "Buyer's guide", "How-to", "FAQ"}
STYLE_ENUM = {"Informative", "Analytical", "Instructive", "Persuasive", "Conversational"}
TONE_ENUM = {"Authoritative", "Caring", "Friendly", "Informative", "Formal", "Conversational"}


def validate_kw_response(obj: dict) -> list[str]:
    errors = []
    if not isinstance(obj, dict):
        return ["Response is not a JSON object"]

    kws = obj.get("keywords")
    if not isinstance(kws, list) or len(kws) < 2:
        return ["keywords must be a list with >= 2 items"]

    for idx, item in enumerate(kws):
        if not isinstance(item, dict):
            errors.append(f"keywords[{idx}] must be an object with 'keyword' and 'intent'")
            continue

        kw_val = item.get("keyword")
        if not isinstance(kw_val, str) or not kw_val.strip():
            errors.append(f"keywords[{idx}].keyword missing or empty")

        intent = item.get("intent")
        if intent not in INTENT_ENUM:
            errors.append(f"keywords[{idx}].intent '{intent}' not in enum")

    return errors


def validate_cb_response(obj: dict) -> list[str]:
    errors = []
    if not isinstance(obj, dict):
        return ["Response is not a JSON object"]

    for field in ["primary_keyword", "target_audience", "suggested_cta"]:
        val = obj.get(field)
        if not isinstance(val, str) or not val.strip():
            errors.append(f"'{field}' missing or empty")

    if obj.get("dominant_intent") not in INTENT_ENUM:
        errors.append(f"dominant_intent '{obj.get('dominant_intent')}' not in enum")
    if obj.get("funnel_stage") not in FUNNEL_ENUM:
        errors.append(f"funnel_stage '{obj.get('funnel_stage')}' not in enum")
    if obj.get("recommended_content_type") not in CONTENT_TYPE_ENUM:
        errors.append(f"recommended_content_type '{obj.get('recommended_content_type')}' not in enum")
    if obj.get("recommended_style") not in STYLE_ENUM:
        errors.append(f"recommended_style '{obj.get('recommended_style')}' not in enum")
    if obj.get("recommended_tone") not in TONE_ENUM:
        errors.append(f"recommended_tone '{obj.get('recommended_tone')}' not in enum")

    sec_kw = obj.get("secondary_keywords", [])
    if not isinstance(sec_kw, list) or len(sec_kw) < 1:
        errors.append("secondary_keywords must have >= 1 item")

    talking_pts = obj.get("key_talking_points", [])
    if not isinstance(talking_pts, list) or len(talking_pts) < 3:
        errors.append("key_talking_points must have >= 3 items")

    geo = obj.get("geo_blueprint")
    if not isinstance(geo, dict):
        errors.append("geo_blueprint missing or not a dict")
    else:
        for key in ["answer_block_focus", "comparison_table_idea"]:
            val = geo.get(key)
            if not isinstance(val, str) or not val.strip():
                errors.append(f"geo_blueprint.{key} missing or empty")
        faqs = geo.get("faq_questions", [])
        if not isinstance(faqs, list) or len(faqs) < 2:
            errors.append("geo_blueprint.faq_questions must have >= 2 items")

    return errors


def dedup_key_kw(obj: dict) -> str:
    kws = []
    for item in obj.get("keywords", []):
        if isinstance(item, dict):
            kws.append(item.get("keyword", ""))
        else:
            kws.append(str(item))
    return hashlib.md5("|".join(sorted(kws)).encode()).hexdigest()


def dedup_key_cb(obj: dict) -> str:
    # A unique brief is defined by the combination of primary keyword, audience, and secondary keywords
    pk = str(obj.get("primary_keyword", "")).lower().strip()
    audience = str(obj.get("target_audience", "")).lower().strip()
    sec = "|".join(sorted(str(s).lower().strip() for s in obj.get("secondary_keywords", [])))
    return hashlib.md5(f"{pk}|{audience}|{sec}".encode()).hexdigest()


def process(task: str, inp: Path, out: Path) -> int:
    seen_hashes = set()
    good, bad = [], []

    with inp.open("r", encoding="utf-8") as f:
        lines = f.readlines()

    print(f"[INFO] Task {task}: validating {len(lines)} raw samples from {inp.name}...")

    for lineno, line in enumerate(lines, 1):
        line = line.strip()
        if not line:
            continue

        try:
            record = json.loads(line)
        except json.JSONDecodeError as e:
            bad.append((lineno, f"outer JSON parse error: {e}"))
            continue

        messages = record.get("messages", [])
        assistant_msg = next(
            (m["content"] for m in messages if m.get("role") == "assistant"), None
        )
        if assistant_msg is None:
            bad.append((lineno, "missing assistant message"))
            continue

        try:
            obj = json.loads(assistant_msg)
        except json.JSONDecodeError as e:
            bad.append((lineno, f"assistant JSON parse error: {e}"))
            continue

        if task == "KEYWORD_RESEARCH":
            errors = validate_kw_response(obj)
            dk = dedup_key_kw(obj)
        else:
            errors = validate_cb_response(obj)
            dk = dedup_key_cb(obj)

        if errors:
            bad.append((lineno, "; ".join(errors)))
            continue

        if dk in seen_hashes:
            bad.append((lineno, "duplicate sample"))
            continue
        seen_hashes.add(dk)

        clean = {k: v for k, v in record.items() if k != "_meta"}
        good.append(clean)

    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as f:
        for s in good:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    print(f"[SUCCESS] Valid samples: {len(good)}")
    print(f"[INFO] Dropped samples: {len(bad)}")
    if bad:
        print("[INFO] First 5 validation failures:")
        for lineno, msg in bad[:5]:
            print(f"  Line {lineno}: {msg}")
    print(f"[INFO] Saved cleaned output to {out}")
    return len(good)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate and filter raw ChatML samples")
    parser.add_argument("--task", choices=["KEYWORD_RESEARCH", "CONTENT_BRIEF", "ALL"], default="ALL")
    parser.add_argument("--inp", default="../data/raw/", help="Input directory or file path")
    parser.add_argument("--out", default="../data/", help="Output directory or file path")
    args = parser.parse_args()

    inp = Path(args.inp)
    out = Path(args.out)

    if args.task == "ALL":
        n_kw = process(
            "KEYWORD_RESEARCH",
            inp / "keyword_research_raw.jsonl",
            out / "keyword_research.jsonl",
        )
        n_cb = process(
            "CONTENT_BRIEF",
            inp / "content_brief_raw.jsonl",
            out / "content_brief.jsonl",
        )
        total = n_kw + n_cb
        TARGET_V2 = 2700
        print(f"\n[INFO] Summary: {total} valid samples collected (KW: {n_kw}, CB: {n_cb})")
        if total < TARGET_V2:
            print(f"[WARN] Short by {TARGET_V2 - total} samples. Additional generation required.")
        else:
            print(f"[SUCCESS] Target v2 achieved! {total} high-quality bilingual samples ready for QLoRA training.")
    elif args.task == "KEYWORD_RESEARCH":
        f_inp = inp if inp.suffix == ".jsonl" else inp / "keyword_research_raw.jsonl"
        f_out = out if out.suffix == ".jsonl" else out / "keyword_research.jsonl"
        process("KEYWORD_RESEARCH", f_inp, f_out)
    else:
        f_inp = inp if inp.suffix == ".jsonl" else inp / "content_brief_raw.jsonl"
        f_out = out if out.suffix == ".jsonl" else out / "content_brief.jsonl"
        process("CONTENT_BRIEF", f_inp, f_out)
