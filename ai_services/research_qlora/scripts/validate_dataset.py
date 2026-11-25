"""
Module: validate_dataset.py (v2.1 — Full UI-Coverage Validator)
Description: Strictly validates, deduplicates, audits all UI cases (EN/VI balance, Intent balance,
             4 context combinations, single/multi-topic, single_known/multi_bulk/single_free CB,
             Intent<->Funnel alignment, Vietnamese diacritics), and exports clean ChatML JSONL.
"""

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

INTENT_ENUM = {"Informational", "Commercial", "Transactional", "Navigational"}
FUNNEL_ENUM = {"TOFU", "MOFU", "BOFU"}
CONTENT_TYPE_ENUM = {"Informational", "Buyer's guide", "How-to", "FAQ"}
STYLE_ENUM = {"Informative", "Analytical", "Instructive", "Persuasive", "Conversational"}
TONE_ENUM = {"Authoritative", "Caring", "Friendly", "Informative", "Formal", "Conversational"}

VI_DIACRITICS = set(
    "àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹỵ"
    "ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỶỸỴ"
)


def has_vi_diacritics(text: str) -> bool:
    return any(ch in VI_DIACRITICS for ch in text)


def parse_selected_keywords(user_msg: str) -> list[str]:
    if "Selected keywords:" not in user_msg:
        return []
    kws = []
    for line in user_msg.splitlines():
        line = line.strip()
        if line.startswith("- "):
            raw = line[2:].strip()
            # Strip trailing " (Intent)"
            raw = re.sub(r"\s*\((Informational|Commercial|Transactional|Navigational)\)\s*$", "", raw)
            if raw:
                kws.append(raw)
    return kws


def parse_known_intent(user_msg: str) -> str:
    for line in user_msg.splitlines():
        if line.startswith("Known intent:"):
            return line.split(":", 1)[1].strip()
    return ""


def validate_kw_response(obj: dict, is_vi: bool) -> list[str]:
    errors = []
    if not isinstance(obj, dict):
        return ["Response is not a JSON object"]

    kws = obj.get("keywords")
    if not isinstance(kws, list) or len(kws) < 5:
        return ["keywords must be a list with >= 5 items"]

    vi_no_accents = 0
    for idx, item in enumerate(kws):
        if not isinstance(item, dict):
            errors.append(f"keywords[{idx}] must be an object")
            continue

        kw_val = item.get("keyword")
        if not isinstance(kw_val, str) or not kw_val.strip():
            errors.append(f"keywords[{idx}].keyword missing or empty")
        elif is_vi and not has_vi_diacritics(kw_val):
            vi_no_accents += 1

        intent = item.get("intent")
        if intent not in INTENT_ENUM:
            errors.append(f"keywords[{idx}].intent '{intent}' not in enum")

    if is_vi and vi_no_accents > 1:
        errors.append(f"Vietnamese sample has {vi_no_accents} unaccented/English keywords")

    return errors


def validate_cb_response(obj: dict, user_msg: str, is_vi: bool) -> list[str]:
    errors = []
    if not isinstance(obj, dict):
        return ["Response is not a JSON object"]

    for field in ["primary_keyword", "target_audience", "suggested_cta"]:
        val = obj.get(field)
        if not isinstance(val, str) or not val.strip():
            errors.append(f"'{field}' missing or empty")

    di = obj.get("dominant_intent")
    fs = obj.get("funnel_stage")
    if di not in INTENT_ENUM:
        errors.append(f"dominant_intent '{di}' not in enum")
    if fs not in FUNNEL_ENUM:
        errors.append(f"funnel_stage '{fs}' not in enum")
    if obj.get("recommended_content_type") not in CONTENT_TYPE_ENUM:
        errors.append(f"recommended_content_type '{obj.get('recommended_content_type')}' not in enum")
    if obj.get("recommended_style") not in STYLE_ENUM:
        errors.append(f"recommended_style '{obj.get('recommended_style')}' not in enum")
    if obj.get("recommended_tone") not in TONE_ENUM:
        errors.append(f"recommended_tone '{obj.get('recommended_tone')}' not in enum")

    # Known intent consistency
    known_intent = parse_known_intent(user_msg)
    if known_intent and di != known_intent:
        errors.append(f"dominant_intent '{di}' != Known intent '{known_intent}'")

    # Strict Intent <-> Funnel consistency
    if di == "Informational" and fs != "TOFU":
        errors.append(f"Intent/Funnel mismatch: Informational -> {fs}")
    elif di == "Commercial" and fs != "MOFU":
        errors.append(f"Intent/Funnel mismatch: Commercial -> {fs}")
    elif di == "Transactional" and fs != "BOFU":
        errors.append(f"Intent/Funnel mismatch: Transactional -> {fs}")
    elif di == "Navigational" and fs not in {"MOFU", "BOFU"}:
        errors.append(f"Intent/Funnel mismatch: Navigational -> {fs}")

    sec_kw = obj.get("secondary_keywords", [])
    selected_kws = parse_selected_keywords(user_msg)
    min_sec = 1 if selected_kws else 2
    if not isinstance(sec_kw, list) or len(sec_kw) < min_sec:
        errors.append(f"secondary_keywords must have >= {min_sec} items")

    # Multi-keyword coverage check
    if selected_kws and not errors:
        sel_norm = {k.lower() for k in selected_kws}
        pk_norm = obj["primary_keyword"].strip().lower()
        sec_norm = {str(s).strip().lower() for s in sec_kw}
        if pk_norm not in sel_norm:
            errors.append(f"multi_bulk primary_keyword '{pk_norm}' not in selected keywords")
        missing = sel_norm - ({pk_norm} | sec_norm)
        if missing:
            errors.append(f"multi_bulk missing selected keywords: {missing}")

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

    if is_vi and not errors:
        blob = f"{obj['target_audience']} {obj['suggested_cta']} {geo['answer_block_focus']}"
        if not has_vi_diacritics(blob):
            errors.append("Vietnamese brief missing Vietnamese diacritics")

    return errors


def dedup_key_kw(obj: dict) -> str:
    kws = [str(item.get("keyword", "")).lower().strip() for item in obj.get("keywords", []) if isinstance(item, dict)]
    return hashlib.md5("|".join(sorted(kws)).encode()).hexdigest()


def dedup_key_cb(obj: dict, user_msg: str) -> str:
    selected = parse_selected_keywords(user_msg)
    if selected:
        sig = "multi:" + "|".join(sorted(k.lower() for k in selected))
    else:
        sig = "single:" + str(obj.get("primary_keyword", "")).lower().strip()
    return hashlib.md5(sig.encode()).hexdigest()


def detect_ctx_combo(user_msg: str) -> str:
    has_biz = "Business description:" in user_msg
    has_cust = "Target customer:" in user_msg
    if has_biz and has_cust:
        return "both"
    if has_biz:
        return "biz_only"
    if has_cust:
        return "cust_only"
    return "none"


def process(task: str, inp: Path, out: Path) -> int:
    seen_hashes = set()
    good, bad = [], []
    lang_counts = Counter()
    intent_counts = Counter()
    ctx_counts = Counter()
    mode_counts = Counter()
    niche_counts = Counter()

    if not inp.exists():
        print(f"[WARN] Input file not found: {inp}")
        return 0

    with inp.open("r", encoding="utf-8") as f:
        lines = f.readlines()

    print(f"\n[INFO] Task {task}: validating {len(lines)} raw samples from {inp.name}...")

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
        user_msg = next((m["content"] for m in messages if m.get("role") == "user"), "")
        assistant_msg = next((m["content"] for m in messages if m.get("role") == "assistant"), None)
        if assistant_msg is None:
            bad.append((lineno, "missing assistant message"))
            continue

        is_vi = "Language: Vietnamese" in user_msg

        try:
            obj = json.loads(assistant_msg)
        except json.JSONDecodeError as e:
            bad.append((lineno, f"assistant JSON parse error: {e}"))
            continue

        if task == "KEYWORD_RESEARCH":
            errors = validate_kw_response(obj, is_vi)
            dk = dedup_key_kw(obj)
        else:
            errors = validate_cb_response(obj, user_msg, is_vi)
            dk = dedup_key_cb(obj, user_msg)

        if errors:
            bad.append((lineno, "; ".join(errors)))
            continue

        if dk in seen_hashes:
            bad.append((lineno, "duplicate sample"))
            continue
        seen_hashes.add(dk)

        lang_counts["vi" if is_vi else "en"] += 1
        ctx_counts[detect_ctx_combo(user_msg)] += 1
        niche_counts["has_niche" if "Niche:" in user_msg else "no_niche"] += 1

        if task == "KEYWORD_RESEARCH":
            niche_line = next((l for l in user_msg.splitlines() if l.startswith("Niche:")), "")
            mode_counts["multi_topic" if "," in niche_line else "single_topic"] += 1
            for it in obj.get("keywords", []):
                intent_counts[it.get("intent", "?")] += 1
        else:
            if "Selected keywords:" in user_msg:
                mode_counts["multi_bulk"] += 1
            elif "Known intent:" in user_msg:
                mode_counts["single_known"] += 1
            else:
                mode_counts["single_free"] += 1
            intent_counts[obj.get("dominant_intent", "?")] += 1

        clean = {k: v for k, v in record.items() if k != "_meta"}
        good.append(clean)

    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as f:
        for s in good:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    print(f"[SUCCESS] Valid samples: {len(good)} (EN: {lang_counts['en']}, VI: {lang_counts['vi']})")
    print(f"[INFO] Modes:   {dict(mode_counts)}")
    print(f"[INFO] Context: {dict(ctx_counts)}")
    print(f"[INFO] Niche:   {dict(niche_counts)}")
    print(f"[INFO] Intents: {dict(intent_counts)}")
    print(f"[INFO] Dropped: {len(bad)}")
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
        n_kw = process("KEYWORD_RESEARCH", inp / "keyword_research_raw.jsonl", out / "keyword_research.jsonl")
        n_cb = process("CONTENT_BRIEF", inp / "content_brief_raw.jsonl", out / "content_brief.jsonl")
        total = n_kw + n_cb
        print(f"\n[SUMMARY] Total clean v2.1 samples: {total} (KW: {n_kw}, CB: {n_cb})")
        if total >= 2200:
            print(f"[SUCCESS] High-purity full-coverage Dataset ready for QLoRA training ({total} samples)!")
        else:
            print(f"[WARN] Collected {total} samples (target: ~2400).")
    elif args.task == "KEYWORD_RESEARCH":
        f_inp = inp if inp.suffix == ".jsonl" else inp / "keyword_research_raw.jsonl"
        f_out = out if out.suffix == ".jsonl" else out / "keyword_research.jsonl"
        process("KEYWORD_RESEARCH", f_inp, f_out)
    else:
        f_inp = inp if inp.suffix == ".jsonl" else inp / "content_brief_raw.jsonl"
        f_out = out if out.suffix == ".jsonl" else out / "content_brief.jsonl"
        process("CONTENT_BRIEF", f_inp, f_out)
